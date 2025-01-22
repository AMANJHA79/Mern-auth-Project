// Import required dependencies and email templates
const { transporter, sender } = require('./email-brevo');
const {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
} = require('./emailTemplate');

/**
 * Sends a verification email to a new user
 * @param {string} recipientEmail - The email address of the recipient
 * @param {string} verificationCode - The verification code to be sent
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode);
    await transporter.sendMail({
        from: sender,
        to: recipientEmail,
        subject: 'Verify Your Email',
        html: emailContent,
    });
};

/**
 * Sends a password reset email with a reset URL
 * @param {string} recipientEmail - The email address of the recipient
 * @param {string} resetURL - The URL for password reset
 * @returns {Promise<void>}
 */
const sendPasswordResetEmail = async (recipientEmail, resetURL) => {
    const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL);
    await transporter.sendMail({
        from: sender,
        to: recipientEmail,
        subject: 'Reset Your Password',
        html: emailContent,
    });
};

/**
 * Sends a confirmation email after successful password reset
 * @param {string} recipientEmail - The email address of the recipient
 * @returns {Promise<void>}
 */
const sendResetSuccessEmail = async (recipientEmail) => {
    const emailContent = PASSWORD_RESET_SUCCESS_TEMPLATE;
    await transporter.sendMail({
        from: sender,
        to: recipientEmail,
        subject: 'Password Reset Successful',
        html: emailContent,
    });
};

/**
 * Sends a welcome email to newly registered users
 * @param {string} recipientEmail - The email address of the recipient
 * @param {string} name - The name of the recipient
 * @returns {Promise<void>}
 */
const sendWelcomeEmail = async (recipientEmail, name) => {
    const emailContent = `Welcome, ${name}! Thank you for registering.`;
    await transporter.sendMail({
        from: sender,
        to: recipientEmail,
        subject: 'Welcome to Our Service',
        html: emailContent,
    });
};

// Export all email sending functions
module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendWelcomeEmail,
};
