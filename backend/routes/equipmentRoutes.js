const express = require('express');
const router = express.Router();

const equipmentController = require('../controllers/equipmentController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Protect all routes
// router.use(protect);

// ➕ Create
router.post('/', equipmentController.createEquipment);

// 📥 Get all
router.get('/', equipmentController.getAllEquipment);

// 📄 Get one
router.get('/:id', equipmentController.getEquipmentById);

// ✏️ Update
router.put('/:id', equipmentController.updateEquipment);

// ❌ Delete
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;