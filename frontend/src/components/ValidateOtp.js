import React, { useState } from "react";
import axios from "axios";

const ValidateOtp = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleValidate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/validate-otp", {
        phone,
        otp,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred during OTP validation."
      );
    }
  };

  return (
    <div>
      <h2>Validate OTP</h2>
      <form onSubmit={handleValidate}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Validate</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ValidateOtp;
