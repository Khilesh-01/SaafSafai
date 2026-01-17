const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.ADMIN_PASS
  }
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"saafsafai" <${process.env.EMAIL_ADMIN}>`,
    to,
    subject,
    html
  });
}

module.exports = sendEmail;
