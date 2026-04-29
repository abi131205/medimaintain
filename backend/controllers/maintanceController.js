const MaintenanceTask = require("../models/MaintenanceTask");
const Equipment = require("../models/Equipment");

// 🧠 Helper: calculate next due date
const calculateNextDueDate = (lastDate, frequency) => {
  const date = new Date(lastDate);

  if (frequency === "Monthly") {
    date.setMonth(date.getMonth() + 1);
  } else if (frequency === "Quarterly") {
    date.setMonth(date.getMonth() + 3);
  } else if (frequency === "Yearly") {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date;
};

// ➕ Create Maintenance Task
exports.createMaintenanceTask = async (req, res) => {
  try {
    const {
      equipmentId,
      maintenanceType,
      description,
      lastMaintained,
      frequency,
      assignedTo,
      notes,
    } = req.body;

    // 🔍 Check equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // 🧠 Auto calculate next due
    const nextDueDate = calculateNextDueDate(lastMaintained, frequency);

    const task = await MaintenanceTask.create({
      equipmentId,
      maintenanceType,
      description,
      lastMaintained,
      frequency,
      nextDueDate,
      assignedTo,
      notes,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Tasks
exports.getAllMaintenanceTasks = async (req, res) => {
  try {
    const tasks = await MaintenanceTask.find()
      .populate("equipmentId", "name assetTag location")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};