// Import the Nodemailer library for email functionality
const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer transporter with Brevo SMTP settings
 * This transporter will be used for sending all emails from the application
 * @type {nodemailer.Transporter}
 */
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Use TLS - true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,     // SMTP username from environment variables
        pass: process.env.SMTP_PASSWORD, // SMTP password from environment variables
    },
});

// Define the default sender email address from environment variables
const sender = process.env.EMAIL_FROM;

// Export the configured transporter and sender email
module.exports = { transporter, sender };
