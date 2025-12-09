const { patientModel } = require('../models/patient.model');
const logger = require('../config/logger');

class PatientController {
async createPatient(req, res) {
  try {
    // Get user ID from authentication middleware
    const userId = req.user ? req.user.id : null;

    // Validate input
    const validatedData = await patientModel.validationSchema.validateAsync(req.body, { 
      abortEarly: false 
    });

    // Create patient
    const patient = await patientModel.create(validatedData, userId);
    
    logger.info(`Patient created: ${patient.patient_id}`, { 
      patientId: patient.patient_id,
      createdBy: userId 
    });
    
    res.status(201).json({
      message: 'Patient created successfully',
      patient: {
        id: patient.id,
        patient_id: patient.patient_id,
        full_name: patient.full_name
      }
    });
  } catch (error) {
    logger.error('Patient creation error', { 
      error: error.message,
      stack: error.stack 
    });
    
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: error.details.map(detail => ({
          message: detail.message,
          path: detail.path
        }))
      });
    }
    
    // Handle unique constraint violations
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Patient with this phone number already exists'
      });
    }
    
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}



async getAllPatients (req, res) { 
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const data = await patientModel.getAll(limit, offset);

    res.json({
      success: true,
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients'
    });
  }
};

  async getPatient(req, res) {
    try {
      const patient = await patientModel.findById(req.params.id);
      
      if (!patient) {
        return res.status(404).json({
          message: 'Patient not found'
        });
      }
      
      // Remove sensitive or unnecessary fields
      const { id, patient_id, full_name, phone, email, ...additionalDetails } = patient;
      
      res.json({
        id,
        patient_id,
        full_name,
        phone,
        email,
        additional_details: additionalDetails
      });
    } catch (error) {
      logger.error('Get patient error', { 
        identifier: req.params.id,
        error: error.message 
      });
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async updatePatient(req, res) {
    try {
      // Validate input, allowing partial updates
      const validatedData = await patientModel.validationSchema
        .fork(Object.keys(req.body), schema => schema.optional())
        .validateAsync(req.body, { abortEarly: false });
      
      const updated = await patientModel.update(req.params.id, validatedData);
      
      if (!updated) {
        return res.status(404).json({
          message: 'Patient not found'
        });
      }
      
      logger.info(`Patient updated: ${req.params.id}`);
      
      res.json({
        message: 'Patient updated successfully',
        updated: true
      });
    } catch (error) {
      logger.error('Patient update error', { 
        identifier: req.params.id,
        error: error.message 
      });
      
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

  async deletePatient(req, res) {
    try {
      const deleted = await patientModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          message: 'Patient not found'
        });
      }
      
      logger.info(`Patient deleted: ${req.params.id}`);
      
      res.json({
        message: 'Patient deleted successfully',
        deleted: true
      });
    } catch (error) {
      logger.error('Patient deletion error', { 
        identifier: req.params.id,
        error: error.message 
      });
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async searchPatients(req, res) {
    try {
      const { query, limit, offset } = req.query;
      
      const results = await patientModel.search(
        query, 
        parseInt(limit) || 20, 
        parseInt(offset) || 0
      );
      
      res.json(results);
    } catch (error) {
      logger.error('Patient search error', { 
        query: req.query,
        error: error.message 
      });
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new PatientController();