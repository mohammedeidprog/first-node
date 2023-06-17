const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1- create transporter (mail service like : gmail, mailgun, mailtrap, sendgrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure is true = 465 , if false = 587
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2- define email options (to , from , subject, email content)
  const mailOpts = {
    to: options.to,
    from: `E-SHOP <Staaar>`,
    subject: options.subject,
    html: options.message,
  };
  // 3- send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;

// const html = `
// <h1>Hello world</h1>
// <p>Isn't nodemailer useful?</p>
// `;

// async function main() {
//   nodemailer.createTransport({});
// }
