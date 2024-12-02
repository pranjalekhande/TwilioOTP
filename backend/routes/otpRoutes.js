const express = require("express");
const router = express.Router();
const { requestOtp , registerUser, validateOtp, resendOtp} = require("../controllers/otpController");
const { checkSessionExpiry } = require("../middleware/sessionMiddleware");

router.post("/validate-otp", validateOtp);
router.post("/register", registerUser);
router.post("/request-otp", requestOtp);
router.post("/resend-otp", resendOtp);


router.post("/validate-otp", checkSessionExpiry, validateOtp);

module.exports = router;
