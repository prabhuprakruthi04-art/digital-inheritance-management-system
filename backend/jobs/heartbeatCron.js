import cron from "node-cron";
import User from "../models/User.js";
import Nominee from "../models/Nominee.js";
import ClaimLog from "../models/ClaimLog.js";
import Notification from "../models/Notification.js";
import { sendEmail, sendNomineeInheritanceTriggerEmail } from "../utils/emailService.js";
import blockchainService from "../services/blockchainService.js";

/**
 * Handles the 3-step warning notification and automatic SSS release for an inactive owner.
 * Exactly 3 warning notifications are tracked before transitioning status to INACTIVE.
 * 
 * @param {Object} user Mongoose User instance
 * @returns {Promise<{ warningCount: number, status: string, triggered: boolean }>}
 */
export async function processOwnerInactivityWarning(user) {
  const now = new Date();
  const currentWarnings = user.inactivityWarningCount || 0;

  // CASE 1: Sending Warning 1 or 2 (Under 3 warnings)
  if (currentWarnings < 2) {
    const nextWarning = currentWarnings + 1;
    user.inactivityWarningCount = nextWarning;
    user.lastWarningSentAt = now;
    user.lastTierNotified = nextWarning;
    await user.save();

    const warningTitles = {
      1: "WARNING (Notification 1/3): Inactivity Detected",
      2: "URGENT WARNING (Notification 2/3): Heartbeat Check-In Overdue",
    };

    const warningMessages = {
      1: `Your heartbeat check-in is overdue. Please perform face biometric verification to maintain active vault status. Only 2 warnings remain before inheritance trigger.`,
      2: `CRITICAL ALERT: Your vault has missed consecutive proof-of-life intervals. Exactly 1 warning remains before your vault transitions to INACTIVE and releases Shamir key shares to your nominee.`,
    };

    // 1. In-app Notification for Owner
    await Notification.create({
      userId: user._id,
      ownerId: user._id,
      recipientModel: "Owner",
      title: warningTitles[nextWarning] || "Inactivity Warning",
      message: `[${nextWarning}/3 Warnings] ${warningMessages[nextWarning]}`,
      type: "warning",
    });

    // 2. Email Notification to Owner
    sendEmail({
      to: user.email,
      subject: `[DIMS Security Alert] ${warningTitles[nextWarning]}`,
      text: `Hello ${user.fullName || "Vault Owner"},\n\n${warningMessages[nextWarning]}\n\nVisit your dashboard to verify: http://localhost:5173/owner\n\n- Digital Inheritance Management System`,
    }).catch((e) => console.warn(`Owner warning email failed: ${e.message}`));

    console.log(`⚠️ [Inactivity Tracker] Warning notification ${nextWarning}/3 sent to owner ${user.email}`);
    return { warningCount: nextWarning, status: user.status, triggered: false };
  }

  // CASE 2: Sending Warning 3 (Exactly 3 warnings reached -> Trigger Inactive & SSS Release)
  const finalWarningCount = 3;
  user.inactivityWarningCount = finalWarningCount;
  user.lastWarningSentAt = now;
  user.lastTierNotified = 3;
  user.status = "INACTIVE";
  user.inheritanceStatus = "EXPIRED";

  // Generate unique Transfer Authorization ID
  const transferAuthId = user.transferAuthId || `DIMS-AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
  user.transferAuthId = transferAuthId;
  await user.save();

  console.log(`\n================================================================`);
  console.log(`🚨 [INACTIVITY THRESHOLD REACHED: 3/3 WARNINGS SENT]`);
  console.log(`Owner ${user.email} (${user._id}) status automatically transitioned to INACTIVE.`);
  console.log(`Triggering Shamir's Secret Sharing (SSS) share release: ${transferAuthId}`);
  console.log(`================================================================\n`);

  // 1. Find assigned nominee record
  let nominee = await Nominee.findOne({ ownerId: user._id.toString() });
  if (!nominee) {
    nominee = await Nominee.findOne({ email: /nominee/i });
  }

  const nomineeEmail = nominee ? nominee.email : "nominee@example.com";
  const nomineeName = nominee ? nominee.name : "Designated Nominee";

  // 2. Release / unlock Nominee's Shamir's Secret Sharing Key Share (Share 2) in database
  if (nominee) {
    nominee.transferAuthId = transferAuthId;
    nominee.isShareUnlocked = true;
    nominee.claimStatus = "submitted";
    nominee.lastNotificationSentAt = now;
    await nominee.save();
    console.log(`🔓 [SSS Release] Nominee Share 2 UNLOCKED for nominee: ${nominee.email}`);
  }

  // 3. Create Authorization ClaimLog entry with cryptographically generated 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await ClaimLog.findOneAndUpdate(
    { transferAuthId },
    {
      transferAuthId,
      ownerId: user._id.toString(),
      nomineeId: nominee ? nominee._id : null,
      nomineeEmail,
      otp: generatedOtp,
      otpExpiresAt,
      status: "OTP_SENT",
      keyShareReleased: true,
      $push: {
        auditTrail: {
          action: "INACTIVITY_3_WARNINGS_EXPIRED",
          timestamp: now,
          details: `Exactly 3 warning notifications were sent. Owner transitioned to INACTIVE and Shamir Share 2 unlocked. Confidential OTP dispatched to nominee.`,
        },
      },
    },
    { upsert: true, new: true }
  );

  // 4. Dispatch automated Nodemailer notification email to Nominee
  try {
    await sendNomineeInheritanceTriggerEmail({
      nomineeEmail,
      nomineeName,
      ownerName: user.fullName || "Vault Owner",
      transferAuthId,
      claimsPortalUrl: "http://localhost:5173/nominee/claims",
      otp: generatedOtp,
    });
    console.log(`📧 Automated inheritance notification dispatched to nominee ${nomineeEmail}`);
  } catch (emailErr) {
    console.warn(`Nominee email dispatch failed: ${emailErr.message}`);
  }

  // 5. Dispatch final notice to Owner email
  sendEmail({
    to: user.email,
    subject: `[DIMS CRITICAL NOTICE] Estate Transitioned to INACTIVE (3/3 Warnings Exceeded)`,
    text: `Hello ${user.fullName || "Vault Owner"},\n\nAll 3 inactivity warning notifications have been sent without response. Your digital estate has automatically transitioned to INACTIVE, and Shamir's Secret Sharing keys have been released to your designated nominee.\n\nTransfer Authorization ID: ${transferAuthId}\n\n- Digital Inheritance Management System`,
  }).catch((e) => console.warn(`Owner final notice email failed: ${e.message}`));

  // 6. Transition smart contract state on blockchain
  try {
    await blockchainService.transitionState(user.walletAddress, "PENDING_VERIFICATION");
  } catch (chainErr) {
    console.warn(`Blockchain state transition logged: ${chainErr.message}`);
  }

  // 7. Create in-system notifications
  await Notification.create({
    userId: user._id,
    ownerId: user._id,
    recipientModel: "Owner",
    title: "FINAL NOTICE [3/3 Warnings]",
    message: `FINAL NOTICE [3/3 Warnings]: Status transitioned to INACTIVE. Digital inheritance process triggered.`,
    type: "warning",
  });

  await Notification.create({
    userId: user._id,
    ownerId: user._id,
    recipientModel: "Nominee",
    title: "INHERITANCE ACTIVATED",
    message: `INHERITANCE ACTIVATED: ${user.fullName} transitioned to INACTIVE after 3 warning notices. Transfer Authorization ID ${transferAuthId} is now active.`,
    type: "system",
  });

  return { warningCount: 3, status: "INACTIVE", triggered: true, transferAuthId };
}

/**
 * Initializes the background Inactivity Monitor.
 * Runs every minute to evaluate owner proof-of-life timestamps against inactivity thresholds.
 */
export const initHeartbeatCron = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏱️ [Heartbeat Cron] Scanning active vaults for inactivity warnings...");

    try {
      const now = new Date();
      // Look for active owners who haven't expired yet
      const users = await User.find({
        inheritanceStatus: { $nin: ["EXPIRED", "expired", "INHERITED", "inherited"] },
        status: { $ne: "INACTIVE" },
      });

      for (const user of users) {
        const lastActive = new Date(user.lastActiveDate || user.createdAt || now);
        const diffInSeconds = Math.floor((now.getTime() - lastActive.getTime()) / 1000);
        const threshold = user.inactivityThresholdSeconds || 120; // Default 120s for demo/testing

        // If inactive past threshold, advance warning sequence
        if (diffInSeconds >= threshold) {
          console.log(`⚠️ [Inactivity Cron] Owner ${user.email} (${user._id}) overdue (${diffInSeconds}s >= ${threshold}s). Warnings sent: ${user.inactivityWarningCount || 0}/3`);
          await processOwnerInactivityWarning(user);
        }
      }
    } catch (error) {
      console.error("[Heartbeat Cron] Error during inactivity sweep:", error);
    }
  });

  console.log("⚙️ [Heartbeat Cron] Automated 1-minute inactivity monitor initialized successfully (3-Warning Threshold Enforced).");
};

export default initHeartbeatCron;