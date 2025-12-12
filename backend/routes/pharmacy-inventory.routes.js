const express = require('express');
const router = express.Router();
const PharmacyInventoryController = require('../controllers/pharmacy-inventory.controller');
const validateMiddleware = require('../middleware/validate.middleware');
const PharmacyInventoryModel = require('../models/pharmacy-inventory.model');
const authMiddleware = require('../middleware/authMiddleware.js');
// router.use(authMiddleware.protect);
// Create Inventory Entry
router.post(
  '/inventory',
  PharmacyInventoryController.createInventoryEntry
);

// Get Inventory Entry by ID
router.get(
  '/:id', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.getInventoryEntry
);

// Update Inventory Entry
router.put(
  '/:id', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),

  PharmacyInventoryController.updateInventoryEntry
);

// Decrease Inventory Quantity
router.patch(
  '/:id/decrease', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.decreaseInventoryQuantity
);

// Increase Inventory Quantity
router.patch(
  '/:id/increase', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.increaseInventoryQuantity
);

// Search Inventory
router.get(
  '/search', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.searchInventory
);

// Get Low Stock Items
router.get(
  '/low-stock', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.getLowStockItems
);

// Update Expired Status
router.patch(
  '/update-expired-status', 
//   authMiddleware.requireAuth,
//   authMiddleware.restrictTo('pharmacist', 'admin'),
  PharmacyInventoryController.updateExpiredStatus
);

module.exports = router;