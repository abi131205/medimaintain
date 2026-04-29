require('dotenv').config(); // ADD THIS AT TOP

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const equipmentRoutes = require("./routes/equipmentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("MediMaintain API Running");
});

// API Routes
app.use("/api/equipment", equipmentRoutes);
app.use("/api/auth", authRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});