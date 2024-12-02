import React from "react";
import Register from "./components/Register";
import ValidateOtp from "./components/ValidateOtp";
import ResendOtp from "./components/ResendOtp";

function App() {
  return (
    <div className="App">
      <h1>OTP System</h1>
      <Register />
      <ValidateOtp />
      <ResendOtp />
    </div>
  );
}

export default App;
