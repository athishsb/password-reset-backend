import nodemailer from "nodemailer";

// This function takes email,userId,token
// uses nodemailer npm and gmail service to send password reset email to the user requesting password reset
export const sendPasswordResetMail = async (email, userId, token) => {
  const link = `https://pswd-reset.netlify.app/reset-password/${userId}/${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    to: email,
    from: process.env.ADMIN_EMAIL,
    text: "Reset Password",
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

  const info = await transporter.sendMail(mailOptions);

  console.log("Mail sent:", info.messageId);

  return info;
};
