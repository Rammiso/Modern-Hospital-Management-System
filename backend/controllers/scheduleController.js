const { pool } = require("../config/db");

/**
 * Get all schedules for a specific staff member
 */
exports.getStaffSchedules = async (req, res) => {
    const { staffId } = req.params;
    try {
        const [schedules] = await pool.execute(
            "SELECT * FROM staff_schedules WHERE staff_id = ? ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')",
            [staffId]
        );
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Save or Update a schedule
 */
exports.saveSchedule = async (req, res) => {
    const { staff_id, day_of_week, start_time, end_time, status } = req.body;
    try {
        // Upsert logic
        await pool.execute(
            `INSERT INTO staff_schedules (staff_id, day_of_week, start_time, end_time, status) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             start_time = VALUES(start_time), 
             end_time = VALUES(end_time), 
             status = VALUES(status)`,
            [staff_id, day_of_week, start_time, end_time, status || 'active']
        );
        res.status(200).json({ success: true, message: "Schedule saved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Get all schedules (Admin view)
 */
exports.getAllSchedules = async (req, res) => {
    try {
        const [schedules] = await pool.execute(`
            SELECT s.*, u.full_name as staff_name, r.role_name
            FROM staff_schedules s
            JOIN users u ON s.staff_id = u.id
            JOIN roles r ON u.role_id = r.role_id
            ORDER BY u.full_name, FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
        `);
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
