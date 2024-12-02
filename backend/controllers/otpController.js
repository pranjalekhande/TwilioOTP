const User = require("../models/userModel"); // Import User model
const Otp = require("../models/otpModel");
const twilio = require("twilio");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;



const client = twilio(accountSid, authToken);




exports.requestOtp = async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await Otp.create({ phone, otp });

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};



exports.registerUser = async (req, res) => {
    
    const { phone } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered." });
      }
  
      // Save the user
      const newUser = await User.create({ phone });
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.create({ phone, otp });
  
      // Send OTP
      await client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
  
      res.status(201).json({ message: "User registered and OTP sent successfully." });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Failed to register user." });
    }
  };

  exports.validateOtp = async (req, res) => {
    const { phone, otp } = req.body;
  
    try {
      // Find the OTP record for the phone number
      const otpRecord = await Otp.findOne({ phone });
  
      if (!otpRecord) {
        console.log("status",404)
        return res.status(404).json({ error: "No OTP found for this phone number." });
      }
  
      // Check if the OTP is expired
      const currentTime = new Date();
      const otpCreationTime = otpRecord.createdAt;
      const otpExpiryTime = new Date(otpCreationTime.getTime() + 2 * 60 * 1000); // Add 2 minutes
  
      if (currentTime > otpExpiryTime) {
        // Delete expired OTP from database
        await Otp.deleteOne({ phone });
        console.log("status",406)
        res.status(406).json({ error: "OTP expired. Please request a new OTP." });
      } else if (otpRecord.otp === otp) {
        // OTP is valid
        await Otp.deleteOne({ phone }); // Delete OTP after successful validation
        console.log("status",202)
        res.status(202).json({ message: "OTP validated successfully." });
      } else {
        console.log("status",400)
        res.status(400).json({ error: "Invalid OTP." });
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      console.log("status",500)
      res.status(500).json({ error: "Failed to validate OTP." });
    }
  };

  exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
  
    try {
      // Delete any existing OTPs for the phone number
      await Otp.deleteOne({ phone });
  
      // Generate a new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await Otp.create({ phone, otp });
  
      // Send the new OTP via Twilio
      await client.messages.create({
        body: `Your new OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
  
      res.status(200).json({ message: "New OTP sent successfully." });
    } catch (error) {
      console.error("Error during OTP resend:", error);
      res.status(500).json({ error: "Failed to resend OTP." });
    }
  };
  