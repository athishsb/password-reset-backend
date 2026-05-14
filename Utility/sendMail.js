export const sendPasswordResetMail = async (email, userId, token) => {
  const link = `https://pswd-reset.netlify.app/reset-password/${userId}/${token}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.EMAIL_FROM_ADDRESS,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [{ email }],
      subject: "Reset Password for your app",
      htmlContent: `<h4>Reset your Password</h4><br>
        <p>Hello , Follow this link to reset your app password for your ${email} account.This link is valid for 10 minutes.</p>
        ${link}
        <p>If you didn\'t ask to reset your password, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your app Admin</p>
        `,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Brevo error:", err);
    throw new Error("Email sending failed");
  }

  return await response.json();
};