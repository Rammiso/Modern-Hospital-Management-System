module.exports = (schema) => {
  return async (req, res, next) => {

    // If schema is missing, just skip validation safely
    if (!schema || !schema.validateAsync) {
      return next();
    }

    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        message: "Validation error",
        error: err.message
      });
    }
  };
};
