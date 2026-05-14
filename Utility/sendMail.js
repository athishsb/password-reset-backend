import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// This function takes email,userId,token
// uses nodemailer npm and gmail service to send password reset email to the user requesting password reset
export const sendPasswordResetMail = async (email, userId, token) => {
  try {

    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const link = `https://pswd-reset.netlify.app/reset-password/${userId}/${token}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
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

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw error;
  }
};
