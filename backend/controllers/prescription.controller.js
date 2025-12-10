const PrescriptionModel = require('../models/prescription.model');
const { json } = require('express');

class PrescriptionController {
  async createPrescription(req, res) {
    try {
      // Validate input
      const validatedData = await PrescriptionModel.validationSchema.validateAsync(
        req.body, 
        { abortEarly: false }
      );

      // Create prescription
      const prescription = await PrescriptionModel.create(validatedData);

      res.status(201).json({
        message: 'Prescription created successfully',
        prescription: {
          id: prescription.id,
          drug_name: prescription.drug_name,
          consultation_id: prescription.consultation_id
        }
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

  async getPrescription(req, res) {
    try {
      const prescription = await PrescriptionModel.findById(req.params.id);

      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      res.json(prescription);
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async updatePrescription(req, res) {
    try {
      // Validate input (now full validation, no fork)
      const validatedData = await PrescriptionModel.validationSchema.validateAsync(
        req.body,
        { abortEarly: false }
      );

      const updated = await PrescriptionModel.update(req.params.id, validatedData);

      if (!updated) {
        return res.status(404).json({ message: 'Prescription not found' });
      }

      res.json({
        message: 'Prescription updated successfully',
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

  async dispensePrescription(req, res) {
    try {
      const userId = req.user ? req.user.id : null;

      const dispensed = await PrescriptionModel.dispense(req.params.id, userId);

      if (!dispensed) {
        return res.status(400).json({
          message: 'Prescription cannot be dispensed'
        });
      }

      res.json({
        message: 'Prescription dispensed successfully',
        dispensed: true
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async cancelPrescription(req, res) {
    try {
      const cancelled = await PrescriptionModel.cancel(req.params.id);

      if (!cancelled) {
        return res.status(400).json({
          message: 'Prescription cannot be cancelled'
        });
      }

      res.json({
        message: 'Prescription cancelled successfully',
        cancelled: true
      });
    } catch (error){
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async searchPrescriptions(req, res) {
    try {
      const { 
        consultation_id, 
        patient_id, 
        status, 
        drug_name,
        limit, 
        offset 
      } = req.query;

      const filters = {};

      if (consultation_id) filters.consultation_id = consultation_id;
      if (patient_id) filters.patient_id = patient_id;
      if (status) filters.status = status;
      if (drug_name) filters.drug_name = drug_name;

      const results = await PrescriptionModel.search(
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
}

module.exports = new PrescriptionController();
