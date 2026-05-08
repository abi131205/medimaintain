const express = require("express");

const router = express.Router();

const equipmentController = require("../controllers/equipmentController");

const { protect } = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/authorizeRoles");

// 🔐 Protect all routes
router.use(protect);

// 📥 Everyone can view
router.get("/", equipmentController.getAllEquipment);

router.get("/:id", equipmentController.getEquipmentById);

// 👨‍💼 ADMIN ONLY
router.post(
  "/",
  authorizeRoles("Admin"),
  equipmentController.createEquipment
);

router.put(
  "/:id",
  authorizeRoles("Admin"),
  equipmentController.updateEquipment
);

router.delete(
  "/:id",
  authorizeRoles("Admin"),
  equipmentController.deleteEquipment
);

module.exports = router;