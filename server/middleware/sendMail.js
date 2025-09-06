import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 
const sendMail = async (email, subject, data) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f5f5f5;
          }
          .container {
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          h1 {
              color: #e74c3c;
          }
          p {
              color: #333;
              margin-bottom: 20px;
          }
          .otp {
              font-size: 32px;
              font-weight: bold;
              color: #7b68ee;
              margin-top: 10px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>OTP Verification</h1>
          <p>Hello ${data.name}, your one-time password (OTP) is:</p>
          <div class="otp">${data.otp}</div>
      </div>
  </body>
  </html>`;

  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;