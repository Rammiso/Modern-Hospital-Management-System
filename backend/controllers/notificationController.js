const db = require('../config/db');

/**
 * Get all notifications for the authenticated user
 * GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const notifications = await db.query(
      `SELECT notification_id, staff_id, message, is_read, created_at, updated_at
       FROM notifications
       WHERE staff_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    // Get unread count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as unread_count
       FROM notifications
       WHERE staff_id = ? AND is_read = 0`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: notifications,
      unread_count: countResult.unread_count,
      total: notifications.length,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

/**
 * Get unread notifications only
 * GET /api/notifications/unread
 */
exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await db.query(
      `SELECT notification_id, staff_id, message, is_read, created_at, updated_at
       FROM notifications
       WHERE staff_id = ? AND is_read = 0
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Get Unread Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread notifications',
      error: error.message,
    });
  }
};

/**
 * Mark a notification as read
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const [notification] = await db.query(
      'SELECT * FROM notifications WHERE notification_id = ? AND staff_id = ?',
      [id, userId]
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Mark as read
    await db.query(
      `UPDATE notifications 
       SET is_read = 1, updated_at = NOW() 
       WHERE notification_id = ? AND staff_id = ?`,
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark Notification as Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `UPDATE notifications 
       SET is_read = 1, updated_at = NOW() 
       WHERE staff_id = ? AND is_read = 0`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark All Notifications as Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message,
    });
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify notification belongs to user
    const [notification] = await db.query(
      'SELECT * FROM notifications WHERE notification_id = ? AND staff_id = ?',
      [id, userId]
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Delete notification
    await db.query(
      'DELETE FROM notifications WHERE notification_id = ? AND staff_id = ?',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

/**
 * Create a notification (internal use)
 * POST /api/notifications
 */
exports.createNotification = async (req, res) => {
  try {
    const { staff_id, message } = req.body;

    if (!staff_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'staff_id and message are required',
      });
    }

    await db.query(
      `INSERT INTO notifications (notification_id, staff_id, message, is_read, created_at)
       VALUES (UUID(), ?, ?, FALSE, NOW())`,
      [staff_id, message]
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
    });
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};
