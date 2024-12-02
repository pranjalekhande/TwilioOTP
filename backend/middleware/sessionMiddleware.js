const Otp = require("../models/otpModel");

const checkSessionExpiry = async (req, res, next) => {
  const { phone } = req.body;

  try {
    const otpRecord = await Otp.findOne({ phone });

    if (!otpRecord) {
      return res.status(404).json({ error: "No OTP found for this phone number." });
    }

    // Check if the OTP is expired
    const currentTime = new Date();
    const otpCreationTime = otpRecord.createdAt;
    const otpExpiryTime = new Date(otpCreationTime.getTime() + 2 * 60 * 1000); // Add 2 minutes

    if (currentTime > otpExpiryTime) {
      // Delete expired OTP
      await Otp.deleteOne({ phone });

      // Redirect logic
      res.status(406).json({
        error: "Session expired. Please request a new OTP.",
        redirectTo: "/login", // Provide a redirect link for the frontend
      });
    } else {
      next(); // Continue if the session is valid
    }
  } catch (error) {
    console.error("Error in session middleware:", error);
    res.status(500).json({ error: "Session validation failed." });
  }
};

module.exports = { checkSessionExpiry };
