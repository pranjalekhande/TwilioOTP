import React, { useState } from "react";
import axios from "axios";

const ResendOtp = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/resend-otp", {
        phone,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred while resending OTP."
      );
    }
  };

  return (
    <div>
      <h2>Resend OTP</h2>
      <form onSubmit={handleResend}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Resend OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResendOtp;
