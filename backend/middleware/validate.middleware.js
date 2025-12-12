// backend/middleware/validate.middleware.js

const Joi = require('joi');

const validateMiddleware = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];

      if (!dataToValidate || (typeof dataToValidate === 'object' && Object.keys(dataToValidate).length === 0)) {
        return res.status(400).json({
          message: `No ${source} data provided`,
          error: `Validation requires ${source} data`
        });
      }

      let validationSchema = schema;

      if ((req.method === 'PUT' || req.method === 'PATCH') && schema && typeof schema.describe === 'function') {
        const described = schema.describe();
        const keys = Object.keys(described.keys || {});

        if (keys.length > 0) {
          if (typeof schema.fork === 'function') {
            validationSchema = schema.fork(keys, field => field.optional().allow(null, ''));
          } else {
            const optionalFields = {};
            keys.forEach(key => {
              optionalFields[key] = Joi.any().optional().allow(null, '');
            });
            validationSchema = Joi.object(optionalFields).unknown(true);
          }
        }
      }

      // ❗ FIXED: removed allowUnknown (invalid here)
      const { error, value } = validationSchema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
      });

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

validateMiddleware.validateId = Joi.string()
  .uuid({ version: 'uuidv4' })
  .message('Invalid ID format');

validateMiddleware.validatePagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc')
});

validateMiddleware.formatValidationError = (error) => {
  if (!error || !error.isJoi) return null;

  return error.details.map(detail => ({
    message: detail.message.replace(/"/g, ''),
    path: detail.path,
    type: detail.type
  }));
};

module.exports = validateMiddleware;
