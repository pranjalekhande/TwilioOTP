const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const otpRoutes = require("./routes/otpRoutes");
app.use("/api", otpRoutes);

module.exports = app;
