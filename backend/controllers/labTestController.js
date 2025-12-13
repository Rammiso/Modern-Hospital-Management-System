const db = require("../config/db");

/**
 * Get all Ethiopian MOH standard lab tests
 * GET /api/lab/tests
 */
const getLabTests = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        test_name,
        test_code,
        test_type,
        category,
        description,
        normal_range,
        unit,
        price
      FROM ethiopian_moh_lab_tests
      WHERE is_active = TRUE
      ORDER BY category, test_name
    `;

    const tests = await db.query(query);

    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (error) {
    console.error('Get Lab Tests Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab tests',
      error: error.message,
    });
  }
};

/**
 * Get lab test by ID
 * GET /api/lab/tests/:id
 */
const getLabTest = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT *
      FROM ethiopian_moh_lab_tests
      WHERE id = ? AND is_active = TRUE
    `;

    const tests = await db.query(query, [id]);

    if (tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found',
      });
    }

    res.status(200).json({
      success: true,
      data: tests[0],
    });
  } catch (error) {
    console.error('Get Lab Test Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lab test',
      error: error.message,
    });
  }
};

/**
 * Search lab tests
 * GET /api/lab/tests/search?q=blood&type=blood
 */
const searchLabTests = async (req, res) => {
  const { q, type, category } = req.query;

  try {
    let query = `
      SELECT 
        id,
        test_name,
        test_code,
        test_type,
        category,
        description,
        normal_range,
        unit,
        price
      FROM ethiopian_moh_lab_tests
      WHERE is_active = TRUE
    `;
    const params = [];

    if (q) {
      query += ' AND (test_name LIKE ? OR test_code LIKE ? OR description LIKE ?)';
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (type) {
      query += ' AND test_type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, test_name';

    const tests = await db.query(query, params);

    res.status(200).json({
      success: true,
      data: tests,
      count: tests.length,
    });
  } catch (error) {
    console.error('Search Lab Tests Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search lab tests',
      error: error.message,
    });
  }
};

module.exports = {
  getLabTests,
  getLabTest,
  searchLabTests,
};
