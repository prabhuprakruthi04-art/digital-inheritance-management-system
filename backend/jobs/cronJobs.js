import cron from "node-cron";
import User from "../models/User.js";

/**
 * Initializes background scheduled tasks (Inactivity Monitor).
 */
export const initBackgroundJobs = () => {
  // Runs daily at midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("[Background Job] Running automated inactivity monitor check...");

    try {
      const now = new Date();
      const users = await User.find({ inheritanceStatus: "active" });

      for (const user of users) {
        if (user.lastHeartbeat && user.inactivityPeriodDays) {
          const lastActive = new Date(user.lastHeartbeat);
          const diffInTime = now.getTime() - lastActive.getTime();
          const diffInDays = diffInTime / (1000 * 3600 * 24);

          if (diffInDays >= user.inactivityPeriodDays) {
            user.inheritanceStatus = "triggered";
            await user.save();
            console.log(`[Background Job] Inactivity threshold reached for user ${user._id}.`);
          }
        }
      }
    } catch (error) {
      console.error("[Background Job Error] Inactivity check failed:", error.message);
    }
  });

  console.log("⚙️ Background cron jobs initialized successfully.");
};

export default initBackgroundJobs;