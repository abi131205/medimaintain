const Equipment = require('../models/Equipment');

// ➕ Add Equipment
exports.createEquipment = async (req, res) => {
  try {
    // 🔍 Duplicate check
    const exists = await Equipment.findOne({ assetTag: req.body.assetTag });
    if (exists) {
      return res.status(400).json({ message: 'Asset tag already exists' });
    }

    const equipment = await Equipment.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get Single Equipment
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Equipment
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Equipment
exports.deleteEquipment = async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};