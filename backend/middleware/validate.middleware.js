// backend/middleware/validate.middleware.js

const Joi = require('joi');

/**
 * Middleware for validating request data against a Joi schema
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {string} [source='body'] - Request source to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
const validateMiddleware = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      // Determine the source of validation
      const dataToValidate = req[source];

      // If no data to validate
      if (!dataToValidate || (typeof dataToValidate === 'object' && Object.keys(dataToValidate).length === 0)) {
        return res.status(400).json({
          message: `No ${source} data provided`,
          error: `Validation requires ${source} data`
        });
      }

      // === AUTO-HANDLE UPDATE ROUTES (PUT/PATCH) ===
      let validationSchema = schema;

      if ((req.method === 'PUT' || req.method === 'PATCH') && schema && typeof schema.describe === 'function') {
        const described = schema.describe();
        const keys = Object.keys(described.keys || {});

        if (keys.length > 0) {
          // Joi 17+ supports .fork()
          if (typeof schema.fork === 'function') {
            validationSchema = schema.fork(keys, field => field.optional().allow(null, ''));
          } else {
            // Fallback for Joi 16 or older
            const optionalFields = {};
            keys.forEach(key => {
              optionalFields[key] = Joi.any().optional().allow(null, '');
            });
            validationSchema = Joi.object(optionalFields).unknown(true);
          }
        }
      }

      // === PERFORM VALIDATION ===
      const { error, value } = validationSchema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        allowUnknown: false
      });

      // === HANDLE VALIDATION ERRORS ===
      if (error) {
        const validationErrors = error.details.map(detail => ({
          message: detail.message.replace(/"/g, ''),
          path: detail.path,
          type: detail.type
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation Failed',
          errors: validationErrors
        });
      }

      // === SUCCESS: Attach cleaned data ===
      req[source] = value;
      next();

    } catch (err) {
      console.error('Validation Middleware Error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: 'Validation process failed'
      });
    }
  };
};

// === UTILITY VALIDATORS (keep your originals) ===
validateMiddleware.validateId = Joi.string()
  .uuid({ version: 'uuidv4' })
  .message('Invalid ID format');

validateMiddleware.validatePagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc')
});

// === ERROR FORMATTER ===
validateMiddleware.formatValidationError = (error) => {
  if (!error || !error.isJoi) return null;

  return error.details.map(detail => ({
    message: detail.message.replace(/"/g, ''),
    path: detail.path,
    type: detail.type
  }));
};

module.exports = validateMiddleware;