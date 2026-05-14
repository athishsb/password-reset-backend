import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// This function takes email,userId,token
// uses resend npm to send password reset email to the user requesting password reset
export const sendPasswordResetMail = async (email, userId, token) => {
  try {

    const link = `https://pswd-reset.netlify.app/reset-password/${userId}/${token}`;

    const mailOptions = {
      from: "onboarding@resend.dev",
      to: email,
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

    return await resend.emails.send(mailOptions);
  } catch (error) {
    console.error("MAIL ERROR:", error);
    throw error;
  }
};
