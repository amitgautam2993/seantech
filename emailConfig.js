const nodemailer = require('nodemailer');

// Create an SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465, // Default SMTP port
  secure: true, // Set to true for SSL, false for TLS
  auth: {
    user: 'invoice@seantech.online',
    pass: 'Abcdxyz123@',
  },
});

module.exports = transporter;
