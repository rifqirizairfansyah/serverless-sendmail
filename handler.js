'use strict';
const nodemailer = require('nodemailer');

module.exports.mailer = async (event) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
  });
  
  try {
    await transporter.sendMail({
      from: `erin@gmail.com`,
      to: `${event.first_name}@gmail.com`,
      subject: `Hey this is your ${event.type}`,
      text: `Hello ${event.first_name} ${event.last_name}!.`,
    });

    return {
      statusCode: 200
    }
  } catch (error) {
    throw new Error(error);
  }
};
