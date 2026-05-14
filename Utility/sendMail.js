import nodemailer from "nodemailer";

// This function takes email,userId,token
// uses nodemailer npm to send password reset email to the user requesting password reset
export const sendPasswordResetMail = async (email, userId, token) => {
  const link = `https://pswd-reset.netlify.app/reset-password/${userId}/${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    to: email,
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    subject: "Reset Password for your app",
    text: `Hello,Follow this link to reset your app password for your ${email} account.
        ${link}.If you didn\\'t ask to reset your password, you can ignore this email.
        Thanks,
        Your app Admin`,
    html: `<h4>Reset your Password</h4><br>
        <p>Hello , Follow this link to reset your app password for your ${email} account.This link is valid for 10 minutes.</p>
        ${link}
        <p>If you didn\'t ask to reset your password, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your app Admin</p>
        `,
  };
  return await transporter.sendMail(mailOptions);
};