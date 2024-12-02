const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL; // MongoDB connection string

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });


  