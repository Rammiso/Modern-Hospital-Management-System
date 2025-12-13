const { PharmacyInventoryModel ,pharmacyInventoryModel} = require('../models/pharmacy-inventory.model.js');


class PharmacyInventoryController {
  // Create Inventory Entry
  async createInventoryEntry(req, res) {
    try {
      // Validate input
      const validatedData = await PharmacyInventoryModel.validationSchema.validateAsync(req.body, { 
        abortEarly: false 
      });

      // Create inventory entry
      const inventoryEntry = await pharmacyInventoryModel.create(validatedData);
      
 
      res.status(201).json({
        message: 'Inventory entry created successfully',
        inventoryEntry
      });
    } catch (error) {
  
      
      if (error.isJoi) {
        return res.status(400).json({
          message: 'Validation Error',
          errors: error.details.map(detail => ({
            message: detail.message,
            path: detail.path
          }))
        });
      }
      
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get Inventory Entry
  async getInventoryEntry(req, res) {
    try {
      const inventoryEntry = await pharmacyInventoryModel.findById(req.params.id);
      
      if (!inventoryEntry) {
        return res.status(404).json({
          message: 'Inventory entry not found'
        });
      }
      
      res.json(inventoryEntry);
    } catch (error) {
    
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update Inventory Entry
  async updateInventoryEntry(req, res) {
    try {
      // Validate input, allowing partial updates
      const validatedData = await PharmacyInventoryModel.validationSchema
        .fork(Object.keys(req.body), schema => schema.optional())
        .validateAsync(req.body, { abortEarly: false });
      
      const updated = await pharmacyInventoryModel.update(req.params.id, validatedData);
      
      if (!updated) {
        return res.status(404).json({
          message: 'Inventory entry not found'
        });
      }
      
      res.json({
        message: 'Inventory entry updated successfully',
        updated: true
      });
    } catch (error) {
   
      if (error.isJoi) {
        return res.status(400).json({
          message: 'Validation Error',
          errors: error.details.map(detail => ({
            message: detail.message,
            path: detail.path
          }))
        });
      }
      
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Decrease Inventory Quantity
  async decreaseInventoryQuantity(req, res) {
    try {
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          message: 'Invalid quantity'
        });
      }

      const decreased = await pharmacyInventoryModel.decreaseQuantity(
        req.params.id, 
        quantity
      );

      if (!decreased) {
        return res.status(400).json({
          message: 'Insufficient inventory or invalid entry'
        });
      }

      res.json({
        message: 'Inventory quantity decreased successfully',
        decreased: true
      });
    } catch (error) {

      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Increase Inventory Quantity
  async increaseInventoryQuantity(req, res) {
    try {
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          message: 'Invalid quantity'
        });
      }

      const increased = await pharmacyInventoryModel.increaseQuantity(
        req.params.id, 
        quantity
      );

      if (!increased) {
        return res.status(404).json({
          message: 'Inventory entry not found'
        });
      }

      res.json({
        message: 'Inventory quantity increased successfully',
        increased: true
      });
    } catch (error) {
 
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Search Inventory
  async searchInventory(req, res) {
    try {
      const { 
        drug_name, 
        category,
        status,
        below_reorder_level,
        limit, 
        offset 
      } = req.query;
      
      const filters = {};
      
      if (drug_name) filters.drug_name = drug_name;
      if (category) filters.category = category;
      if (status) filters.status = status;
      if (below_reorder_level) filters.below_reorder_level = true;

      const results = await pharmacyInventoryModel.search(
        filters, 
        parseInt(limit) || 20, 
        parseInt(offset) || 0
      );
      
      res.json(results);
    } catch (error) {
 
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get Low Stock Items
  async getLowStockItems(req, res) {
    try {
      const lowStockItems = await pharmacyInventoryModel.getLowStockItems();


      res.json({
        message: 'Low stock items retrieved successfully',
        lowStockItems
      });
    } catch (error) {
      logger.error('Get low stock items error', { 
        error: error.message 
      });
      
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update Expired Status
  async updateExpiredStatus(req, res) {
    try {
      const expiredCount = await pharmacyInventoryModel.updateExpiredStatus();

      res.json({
        message: 'Expired inventory status updated successfully',
        expiredItemsCount: expiredCount
      });
    } catch (error) {
  
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}


module.exports = new PharmacyInventoryController();