const mongoose = require("mongoose");

const maintenanceTaskSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    maintenanceType: {
      type: String,
      enum: ["Preventive", "Corrective"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    lastMaintained: {
      type: Date,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
      required: true,
    },

    nextDueDate: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Overdue"],
      default: "Pending",
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceTask", maintenanceTaskSchema);