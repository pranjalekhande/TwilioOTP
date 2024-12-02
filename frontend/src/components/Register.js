import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/register", {
        phone,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred during registration."
      );
    }
  };

  return (
    <div>
      <h2>Register Your Phone</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
