import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

const sendEmail = asyncHandler(async (data) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID, // Ensure this is your email
      pass: process.env.MAIL_PASS, // Ensure this is your email password
    },
  });
  console.log("MAIL_ID:", process.env.MAIL_ID);
  console.log("MAIL_PASS:", process.env.MAIL_PASS);


  const mailOptions = {
    from: '"Your App Name" <your-email@gmail.com>', // Sender address
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
});

export default sendEmail;
