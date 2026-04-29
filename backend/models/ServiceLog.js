const mongoose = require("mongoose");

const serviceLogSchema = new mongoose.Schema({
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  serviceDate: Date,
  issueDescription: String,
  actionTaken: String,
  cost: Number,
  downtimeHours: Number
});

module.exports = mongoose.model("ServiceLog", serviceLogSchema);
