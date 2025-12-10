// backend/controllers/consultation.controller.js

const ConsultationModel = require('../models/consultation.model');

class ConsultationController {
  // CREATE CONSULTATION

  async createConsultation(req, res) {
    try {
      const validatedData = await ConsultationModel.validationSchema.validateAsync(req.body, {
        abortEarly: false,
      });

      // Validate vitals logic
      const vitalErrors = ConsultationModel.validateVitals(validatedData);
      if (vitalErrors.length > 0) {
        return res.status(400).json({
          message: 'Invalid vital signs',
          errors: vitalErrors,
        });
      }

      // Auto-calculate BMI
      if (validatedData.weight && validatedData.height) {
        validatedData.bmi = ConsultationModel.calculateBMI(validatedData.weight, validatedData.height);
      }

      const consultation = await ConsultationModel.create(validatedData);

      res.status(201).json({
        success: true,
        message: 'Consultation created successfully',
        data: consultation,
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.details.map((d) => d.message),
        });
      }

      console.error('Create Consultation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create consultation',
        error: error.message,
      });
    }
  }

  // GET BY ID  → GET /consultations/:id
  async getConsultation(req, res) {
    try {
      const consultation = await ConsultationModel.findById(req.params.id);

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        });
      }

      res.status(200).json({
        success: true,
        data: consultation,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // UPDATE  → PUT /consultations/:id
  async updateConsultation(req, res) {
    try {
      const validatedData = await ConsultationModel.validationSchema
        .fork(Object.keys(req.body), (schema) => schema.optional())
        .validateAsync(req.body, { abortEarly: false });

      // Recalculate BMI if weight/height changed
      if (validatedData.weight && validatedData.height) {
        validatedData.bmi = ConsultationModel.calculateBMI(validatedData.weight, validatedData.height);
      }

      const updated = await ConsultationModel.update(req.params.id, validatedData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found or no changes made',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Consultation updated successfully',
      });
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map((d) => d.message),
        });
      }
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // DELETE  → DELETE /consultations/:id
  async deleteConsultation(req, res) {
    try {
      const deleted = await ConsultationModel.update(req.params.id, {
        deleted_at: new Date(),
      }); // Soft delete (or create delete method if you prefer hard delete)

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Consultation not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Consultation deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // SEARCH  → GET /consultations/search
  async searchConsultations(req, res) {
    try {
      const { patient_id, doctor_id, start_date, end_date, page = 1, limit = 20 } = req.query;

      const offset = (page - 1) * limit;

      const result = await ConsultationModel.search(
        {
          
            patient_id,
            doctor_id,
            start_date,
            end_date,
          },
          parseInt(limit),
          parseInt(offset)
      );

      res.status(200).json({
        success: true,
        data: result.consultations,
        pagination: {
          total: result.total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Search failed' });
    }
  }

  // BY PATIENT  → GET /consultations/patient/:patientId
  async getPatientConsultations(req, res) {
    try {
      const result = await ConsultationModel.search(
        { patient_id: req.params.patientId },
        50,
        0
      );

      res.status(200).json({
        success: true,
        data: result.consultations,
        total: result.total,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch patient consultations' });
    }
  }

  // BY DOCTOR  → GET /consultations/doctor/:doctorId
  async getDoctorConsultations(req, res) {
    try {
      const result = await ConsultationModel.search(
        { doctor_id: req.params.doctorId },
        50,
        0
      );

      res.status(200).json({
        success: true,
        data: result.consultations,
        total: result.total,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch doctor consultations' });
    }
  }

  // FOLLOW-UP  → POST /consultations/follow-up
  async createFollowUpConsultation(req, res) {
    // Same logic as create, but maybe pre-fill some data
    return this.createConsultation(req, res); // You can customize later
  }

  // STATS  → GET /consultations/stats
  async getConsultationStatistics(req, res) {
    try {
      // Example: you can extend model with a stats method later
      res.status(200).json({
        success: true,
        message: 'Stats endpoint ready (implement in model if needed)',
        data: { total: 0, today: 0 },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Stats error' });
    }
  }

  // EXPORT REPORT  → GET /consultations/:id/report
  async exportMedicalReport(req, res) {
    try {
      const consultation = await ConsultationModel.findById(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }

      // Here you would generate PDF (using pdfkit or puppeteer)
      // For now, return JSON report
      res.status(200).json({
        success: true,
        report: {
          ...consultation,
          generated_at: new Date().toISOString(),
          generated_by: req.user.name,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Report generation failed' });
    }
  }
}

module.exports = new ConsultationController();