import sgMail from '@sendgrid/mail';
import config from '../config/config.js';
import UserCredentials from '../models/UserCredentials.js'; // Import the UserProfiles model

sgMail.setApiKey(config.sendGridApiKey);

const sendNotificationService = async (userId, message) => {
  try {
    const user = await UserCredentials.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found.');
    }

    const msg = {
      to: user.email,
      from: 'malachirichlin@gmail.com',
      subject: 'Notification',
      text: message,
      html: `<p>${message}</p>`,
    };

    await sgMail.send(msg);
    console.log('Notification sent successfully.');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification.');
  }
};

export default sendNotificationService;