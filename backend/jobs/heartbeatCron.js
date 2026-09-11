import cron from "node-cron";
import User from "../models/User.js";
import Nominee from "../models/Nominee.js";
import ClaimLog from "../models/ClaimLog.js";
import Notification from "../models/Notification.js";
import { sendNomineeInheritanceTriggerEmail } from "../utils/emailService.js";
import blockchainService from "../services/blockchainService.js";

/**
 * Initializes the background Inactivity Monitor.
 * Runs every minute to evaluate owner proof-of-life timestamps against inactivity thresholds.
 */
export const initHeartbeatCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏱️ [Heartbeat Cron] Scanning active vaults for inactivity expiration...");

    try {
      const now = new Date();
      // Look for active owners who haven't expired yet
      const users = await User.find({
        inheritanceStatus: { $nin: ["EXPIRED", "expired", "INHERITED", "inherited"] },
      });

      for (const user of users) {
        const lastActive = new Date(user.lastActiveDate || user.createdAt || now);
        const diffInSeconds = Math.floor((now.getTime() - lastActive.getTime()) / 1000);
        const threshold = user.inactivityThresholdSeconds || 120; // Default 120s for demo/testing

        // Check if user has exceeded their inactivity threshold
        if (diffInSeconds >= threshold) {
          console.log(`⚠️ [Inactivity Cron] Owner ${user.email} (${user._id}) exceeded threshold (${diffInSeconds}s >= ${threshold}s).`);

          // 1. Transition owner status to EXPIRED
          user.inheritanceStatus = "EXPIRED";
          user.status = "INACTIVE";

          // 2. Generate unique Transfer Authorization ID
          const transferAuthId = user.transferAuthId || `DIMS-AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
          user.transferAuthId = transferAuthId;
          await user.save();

          console.log(`🔒 Owner marked EXPIRED. Generated Transfer Auth ID: ${transferAuthId}`);

          // 3. Find assigned nominee record
          let nominee = await Nominee.findOne({ ownerId: user._id.toString() });
          if (!nominee) {
            nominee = await Nominee.findOne({ email: /nominee/i });
          }

          const nomineeEmail = nominee ? nominee.email : "nominee@example.com";
          const nomineeName = nominee ? nominee.name : "Designated Nominee";

          // 4. Release / unlock Nominee's Shamir's Secret Sharing Key Share (Share 2) in database
          if (nominee) {
            nominee.transferAuthId = transferAuthId;
            nominee.isShareUnlocked = true;
            nominee.claimStatus = "submitted";
            nominee.lastNotificationSentAt = now;
            await nominee.save();
            console.log(`🔓 Nominee SSS Share 2 UNLOCKED for nominee: ${nominee.email}`);
          }

          // 5. Create Authorization ClaimLog entry with demo OTP 123456
          const defaultOtp = "123456";
          const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

          await ClaimLog.findOneAndUpdate(
            { transferAuthId },
            {
              transferAuthId,
              ownerId: user._id.toString(),
              nomineeId: nominee ? nominee._id : null,
              nomineeEmail,
              otp: defaultOtp,
              otpExpiresAt,
              status: "OTP_SENT",
              keyShareReleased: true,
              $push: {
                auditTrail: {
                  action: "INACTIVITY_EXPIRATION_TRIGGERED",
                  timestamp: now,
                  details: `Owner exceeded ${threshold}s inactivity limit. Transfer Authorization ID generated and Share 2 unlocked.`,
                },
              },
            },
            { upsert: true, new: true }
          );

          // 6. Dispatch automated Nodemailer notification email
          try {
            await sendNomineeInheritanceTriggerEmail({
              nomineeEmail,
              nomineeName,
              ownerName: user.fullName || "Vault Owner",
              transferAuthId,
              claimsPortalUrl: "http://localhost:5173/nominee/claims",
              demoOtp: defaultOtp,
            });
            console.log(`📧 Automated inheritance notification sent to ${nomineeEmail}`);
          } catch (emailErr) {
            console.warn(`Email dispatch failed: ${emailErr.message}`);
          }

          // 7. Transition smart contract state to PENDING_VERIFICATION on-chain
          try {
            await blockchainService.transitionState(user.walletAddress, "PENDING_VERIFICATION");
          } catch (chainErr) {
            console.warn(`Blockchain state transition logged: ${chainErr.message}`);
          }

          // 8. Create in-system notification record
          await Notification.create({
            recipientModel: "Nominee",
            ownerId: user._id,
            message: `FINAL TRIGGER: ${user.fullName} exceeded heartbeat threshold. Transfer Authorization ID ${transferAuthId} is now active.`,
            type: "INHERITANCE_TRIGGERED",
          });

          console.log(`✅ Automated inheritance pipeline execution complete for owner ${user._id}`);
        } else if (diffInSeconds >= threshold * 0.75 && user.lastTierNotified !== 1) {
          // Warning notification before full expiration
          user.lastTierNotified = 1;
          await user.save();

          await Notification.create({
            recipientModel: "Owner",
            ownerId: user._id,
            message: `HEARTBEAT REMINDER: Your proof-of-life heartbeat check is approaching due date. Verify face to reset timer.`,
            type: "HEARTBEAT_TIER_1",
          });
        }
      }
    } catch (error) {
      console.error("[Heartbeat Cron] Error during inactivity sweep:", error);
    }
  });

  console.log("⚙️ [Heartbeat Cron] Automated 1-minute inactivity monitor initialized successfully.");
};

export default initHeartbeatCron;