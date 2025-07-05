const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transport
  const transporter = nodemailer.createTransport({
    host: process.env.USER_HOST,
    port: process.env.USER_PORT,
    auth: {
      user: process.env.USER_NAME,
      pass: process.env.USER_PASSWORD,
    },
  });

  //send email

  await transporter.sendMail(options);
};

module.exports = sendEmail;
