
import sendNotificationService from '../services/sendNotification.js';

export const sendNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const notification = await Notification.create({ userId, message });
    await sendNotificationService(userId, message);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(400).json({ error: 'Error sending notification.' });
  }
};

