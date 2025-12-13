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
          generated_by: req.user?.name || 'System',
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Report generation failed' });
    }
  }

  // ===========================
  // WORKFLOW METHODS (NEW)
  // ===========================

  /**
   * Get ongoing consultations for a doctor
   * GET /api/consultations/ongoing?doctorId=xxx
   */
  async getOngoingConsultations(req, res) {
    try {
      let { doctorId } = req.query;

      // If no doctorId provided, try to get from authenticated user or use default for testing
      if (!doctorId) {
        doctorId = req.user?.id || '1'; // Use default doctor ID for testing
      }

      const { query } = require('../config/db');

      const sql = `
        SELECT 
          c.id,
          c.status,
          c.created_at,
          c.updated_at,
          p.full_name as patient_name,
          p.patient_id,
          a.appointment_date,
          a.appointment_time
        FROM consultations c
        INNER JOIN patients p ON c.patient_id = p.id
        INNER JOIN appointments a ON c.appointment_id = a.id
        WHERE c.doctor_id = ?
          AND c.status IN ('DRAFT', 'WAITING_FOR_LAB_RESULTS', 'READY_FOR_REVIEW')
        ORDER BY c.updated_at DESC
      `;

      const consultations = await query(sql, [doctorId]);

      res.status(200).json({
        success: true,
        data: consultations,
      });
    } catch (error) {
      console.error('Get Ongoing Consultations Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch ongoing consultations',
        error: error.message,
      });
    }
  }

  /**
   * Save consultation as draft
   * POST /api/consultations/save-draft
   */
  async saveDraft(req, res) {
    try {
      const { query } = require('../config/db');
      const data = req.body;

      // Validate and sanitize BMI value (DECIMAL(4,2) max is 99.99)
      let bmi = data.bmi;
      if (bmi !== null && bmi !== undefined) {
        bmi = parseFloat(bmi);
        if (isNaN(bmi) || !isFinite(bmi)) {
          bmi = null;
        } else if (bmi > 99.99) {
          bmi = 99.99; // Cap at maximum allowed value
        } else if (bmi < 0) {
          bmi = null; // Invalid negative BMI
        }
      }

      // Check if consultation exists (by ID or by appointment_id)
      let consultation;
      let existingConsultation = null;
      
      if (data.id) {
        // Check by consultation ID
        const [existing] = await query('SELECT id FROM consultations WHERE id = ?', [data.id]);
        existingConsultation = existing;
      } else if (data.appointment_id) {
        // Check by appointment ID
        const [existing] = await query('SELECT id FROM consultations WHERE appointment_id = ?', [data.appointment_id]);
        existingConsultation = existing;
      }
      
      if (existingConsultation) {
        // Update existing
        const updateSql = `
          UPDATE consultations SET
            blood_pressure_systolic = ?,
            blood_pressure_diastolic = ?,
            temperature = ?,
            pulse_rate = ?,
            respiratory_rate = ?,
            weight = ?,
            height = ?,
            bmi = ?,
            spo2 = ?,
            symptoms = ?,
            diagnosis = ?,
            icd_code = ?,
            notes = ?,
            status = 'DRAFT',
            updated_at = NOW()
          WHERE id = ?
        `;

        await query(updateSql, [
          data.blood_pressure_systolic ?? null,
          data.blood_pressure_diastolic ?? null,
          data.temperature ?? null,
          data.pulse_rate ?? data.heart_rate ?? null,
          data.respiratory_rate ?? null,
          data.weight ?? null,
          data.height ?? null,
          bmi,
          data.spo2 ?? null,
          data.symptoms ?? null,
          data.diagnosis ?? null,
          data.icd_code ?? null,
          data.notes ?? null,
          existingConsultation.id,
        ]);

        consultation = { id: existingConsultation.id };
      } else {
        // Create new
        const insertSql = `
          INSERT INTO consultations (
            id, appointment_id, patient_id, doctor_id,
            blood_pressure_systolic, blood_pressure_diastolic,
            temperature, pulse_rate, respiratory_rate,
            weight, height, bmi, spo2,
            symptoms, diagnosis, icd_code, notes,
            status, created_at, updated_at
          ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', NOW(), NOW())
        `;

        await query(insertSql, [
          data.appointment_id,
          data.patient_id,
          data.doctor_id,
          data.blood_pressure_systolic ?? null,
          data.blood_pressure_diastolic ?? null,
          data.temperature ?? null,
          data.pulse_rate ?? data.heart_rate ?? null,
          data.respiratory_rate ?? null,
          data.weight ?? null,
          data.height ?? null,
          bmi,
          data.spo2 ?? null,
          data.symptoms ?? null,
          data.diagnosis ?? null,
          data.icd_code ?? null,
          data.notes ?? null,
        ]);

        // Get the created consultation ID
        const [created] = await query(
          'SELECT id FROM consultations WHERE appointment_id = ? ORDER BY created_at DESC LIMIT 1',
          [data.appointment_id]
        );
        consultation = created;
      }

      // Handle prescriptions
      if (data.prescriptions && data.prescriptions.length > 0) {
        // Delete existing prescriptions
        await query('DELETE FROM prescriptions WHERE consultation_id = ?', [consultation.id]);

        // Insert new prescriptions
        for (const rx of data.prescriptions) {
          if (rx.drug_name && rx.dosage) {
            await query(
              `INSERT INTO prescriptions (id, consultation_id, drug_name, dosage, frequency, duration, instructions, status, created_at)
               VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
              [consultation.id, rx.drug_name, rx.dosage, rx.frequency ?? null, rx.duration ?? null, rx.instructions ?? null]
            );
          }
        }
      }

      // Handle lab requests
      if (data.lab_requests && data.lab_requests.length > 0) {
        // Delete existing lab requests
        await query('DELETE FROM lab_requests WHERE consultation_id = ?', [consultation.id]);

        // Insert new lab requests
        for (const lab of data.lab_requests) {
          if (lab.test_name) {
            await query(
              `INSERT INTO lab_requests (id, consultation_id, test_name, test_type, urgency, instructions, status, created_at)
               VALUES (UUID(), ?, ?, ?, ?, ?, 'requested', NOW())`,
              [consultation.id, lab.test_name, lab.test_type ?? 'blood', lab.urgency ?? 'normal', lab.instructions ?? null]
            );
          }
        }
      }

      res.status(200).json({
        success: true,
        message: 'Draft saved successfully',
        data: consultation,
      });
    } catch (error) {
      console.error('Save Draft Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save draft',
        error: error.message,
      });
    }
  }

  /**
   * Send lab request and pause consultation
   * POST /api/consultations/send-lab-request
   */
  async sendLabRequest(req, res) {
    try {
      const { consultation_id, lab_requests } = req.body;
      const { query } = require('../config/db');

      if (!consultation_id || !lab_requests || lab_requests.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Consultation ID and lab requests are required',
        });
      }

      // Get consultation details
      const [consultation] = await query(
        'SELECT * FROM consultations WHERE id = ?',
        [consultation_id]
      );

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        });
      }

      // Create lab requests
      let firstLabRequestId = null;
      for (const lab of lab_requests) {
        if (lab.test_name) {
          await query(
            `INSERT INTO lab_requests (id, consultation_id, test_name, test_type, urgency, instructions, status, created_at)
             VALUES (UUID(), ?, ?, ?, ?, ?, 'requested', NOW())`,
            [consultation_id, lab.test_name, lab.test_type ?? 'blood', lab.urgency ?? 'normal', lab.instructions ?? null]
          );

          if (!firstLabRequestId) {
            // Get the first lab request ID
            const [created] = await query(
              'SELECT id FROM lab_requests WHERE consultation_id = ? ORDER BY created_at DESC LIMIT 1',
              [consultation_id]
            );
            firstLabRequestId = created.id;
          }
        }
      }

      // Update consultation status to WAITING_FOR_LAB_RESULTS
      await query(
        `UPDATE consultations SET 
          status = 'WAITING_FOR_LAB_RESULTS',
          lab_request_id = ?,
          updated_at = NOW()
         WHERE id = ?`,
        [firstLabRequestId, consultation_id]
      );

      // Create notification for lab technician
      await query(
        `INSERT INTO lab_notifications (id, consultation_id, lab_request_id, doctor_id, message, is_read, created_at)
         VALUES (UUID(), ?, ?, ?, ?, FALSE, NOW())`,
        [
          consultation_id,
          firstLabRequestId,
          consultation.doctor_id,
          `New lab request from Dr. ${consultation.doctor_id} for patient ${consultation.patient_id}`,
        ]
      );

      res.status(200).json({
        success: true,
        message: 'Lab request sent successfully',
        data: {
          consultation_id,
          lab_request_id: firstLabRequestId,
          status: 'WAITING_FOR_LAB_RESULTS',
        },
      });
    } catch (error) {
      console.error('Send Lab Request Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send lab request',
        error: error.message,
      });
    }
  }

  /**
   * Finish consultation (complete workflow)
   * POST /api/consultations/finish
   */
  async finishConsultation(req, res) {
    try {
      const data = req.body;
      const { query } = require('../config/db');

      if (!data.consultation_id && !data.id) {
        return res.status(400).json({
          success: false,
          message: 'Consultation ID is required',
        });
      }

      const consultationId = data.consultation_id || data.id;

      // Update consultation status to COMPLETED
      await query(
        `UPDATE consultations SET 
          status = 'COMPLETED',
          updated_at = NOW()
         WHERE id = ?`,
        [consultationId]
      );

      // Update appointment status
      await query(
        `UPDATE appointments SET 
          status = 'completed',
          updated_at = NOW()
         WHERE id = (SELECT appointment_id FROM consultations WHERE id = ?)`,
        [consultationId]
      );

      // Generate billing (simplified - you can expand this)
      const [consultation] = await query(
        'SELECT * FROM consultations WHERE id = ?',
        [consultationId]
      );

      if (consultation) {
        // Create bill
        const billNumber = `BILL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
        
        const consultationFee = 500; // Default consultation fee
        const totalAmount = consultationFee;

        await query(
          `INSERT INTO bills (id, bill_number, patient_id, consultation_id, consultation_fee, total_amount, balance, payment_status, created_at)
           VALUES (UUID(), ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
          [billNumber, consultation.patient_id, consultationId, consultationFee, totalAmount, totalAmount]
        );
      }

      // Update prescription status to ready for dispensing
      await query(
        `UPDATE prescriptions SET status = 'pending' WHERE consultation_id = ?`,
        [consultationId]
      );

      res.status(200).json({
        success: true,
        message: 'Consultation completed successfully',
        data: {
          consultation_id: consultationId,
          status: 'COMPLETED',
        },
      });
    } catch (error) {
      console.error('Finish Consultation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete consultation',
        error: error.message,
      });
    }
  }
}

module.exports = new ConsultationController();