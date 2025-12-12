const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const {pool}= require('../config/db');
const moment = require('moment');

class PharmacyInventoryModel {
  constructor() {
    this.tableName = 'pharmacy_inventory';
  }

  // Validation Schema
  static validationSchema = Joi.object({
    drug_name: Joi.string()
      .max(200)
      .required()
      .trim(),
    generic_name: Joi.string()
      .max(200)
      .optional()
      .allow(null, ''),
    category: Joi.string()
      .max(100)
      .optional()
      .allow(null, ''),
    quantity: Joi.number()
      .integer()
      .min(0)
      .default(0),
    unit: Joi.string()
      .max(50)
      .required()
      .trim(),
    unit_price: Joi.number()
      .precision(2)
      .min(0)
      .required(),
    reorder_level: Joi.number()
      .integer()
      .min(0)
      .default(10),
    expiry_date: Joi.date()
      .min('now')
      .required(),
    status: Joi.string()
      .valid('available', 'expired')
      .default('available')
  });

  // Create Inventory Entry
  async create(inventoryData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Determine status based on expiry date
      const status = moment(inventoryData.expiry_date).isBefore(moment()) 
        ? 'expired' 
        : 'available';

      const [result] = await connection.execute(
        `INSERT INTO ${this.tableName} (
          id, 
          drug_name, 
          generic_name, 
          category, 
          quantity, 
          unit, 
          unit_price, 
          reorder_level, 
          expiry_date,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          inventoryData.drug_name,
          inventoryData.generic_name || null,
          inventoryData.category || null,
          inventoryData.quantity || 0,
          inventoryData.unit,
          inventoryData.unit_price,
          inventoryData.reorder_level || 10,
          inventoryData.expiry_date,
          status
        ]
      );

      await connection.commit();

      return {
        id: uuidv4(),
        ...inventoryData,
        status
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Find Inventory Entry by ID
  async findById(inventoryId) {
    const connection = await database.getConnection();
    try {
      const [inventories] = await connection.execute(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [inventoryId]
      );

      return inventories[0] || null;
    } finally {
      connection.release();
    }
  }

  // Update Inventory Entry
  async update(inventoryId, updateData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Determine status if expiry date is provided
      if (updateData.expiry_date) {
        updateData.status = moment(updateData.expiry_date).isBefore(moment()) 
          ? 'expired' 
          : 'available';
      }

      const updateFields = Object.keys(updateData)
        .filter(key => updateData[key] !== undefined)
        .map(key => `${key} = ?`)
        .join(', ');

      if (!updateFields) {
        return false;
      }

      const updateValues = [
        ...Object.keys(updateData)
          .filter(key => updateData[key] !== undefined)
          .map(key => updateData[key]),
        inventoryId
      ];

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET ${updateFields} 
         WHERE id = ?`,
        updateValues
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Search Inventory
  async search(filters = {}, limit = 20, offset = 0) {
    const connection = await pool.getConnection();
    try {
      const whereConditions = [];
      const queryParams = [];

      if (filters.drug_name) {
        whereConditions.push('drug_name LIKE ?');
        queryParams.push(`%${filters.drug_name}%`);
      }

      if (filters.category) {
        whereConditions.push('category = ?');
        queryParams.push(filters.category);
      }

      if (filters.status) {
        whereConditions.push('status = ?');
        queryParams.push(filters.status);
      }

      if (filters.below_reorder_level) {
        whereConditions.push('quantity <= reorder_level');
      }

      const whereClause = whereConditions.length 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      const [inventory] = await connection.execute(
        `SELECT * FROM ${this.tableName}
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

      // Count total
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM ${this.tableName}
         ${whereClause}`,
        queryParams
      );

      return {
        inventory,
        total: countResult[0].total,
        limit,
        offset
      };
    } finally {
      connection.release();
    }
  }

  // Decrease Inventory Quantity
  async decreaseQuantity(inventoryId, quantity) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET quantity = GREATEST(0, quantity - ?)
         WHERE id = ? AND quantity >= ?`,
        [quantity, inventoryId, quantity]
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Increase Inventory Quantity
  async increaseQuantity(inventoryId, quantity) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET quantity = quantity + ?
         WHERE id = ?`,
        [quantity, inventoryId]
      );

      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Check and Update Expired Status
  async updateExpiredStatus() {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        `UPDATE ${this.tableName} 
         SET status = 'expired'
         WHERE expiry_date < CURRENT_DATE AND status = 'available'`
      );

      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get Low Stock Items
  async getLowStockItems() {
    const connection = await pool.getConnection();
    try {
      const [lowStockItems] = await connection.execute(
        `SELECT * FROM ${this.tableName}
         WHERE quantity <= reorder_level AND status = 'available'`
      );

      return lowStockItems;
    } finally {
      connection.release();
    }
  }
}

module.exports = { PharmacyInventoryModel, pharmacyInventoryModel: new PharmacyInventoryModel() };