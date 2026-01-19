const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Get all notifications for the user
router.get('/', notificationController.getNotifications);

// Get unread notifications
router.get('/unread', notificationController.getUnreadNotifications);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

// Create notification (Admin or internal system use)
router.post('/', authorize('admin'), notificationController.createNotification);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
