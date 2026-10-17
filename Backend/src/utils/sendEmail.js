
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, otp) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Taskly - Email Verification",
    text: `Your verification OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial; padding: 24px;">
        <h2>Verify Your Email</h2>
        <p>Your Taskly verification code is:</p>
        <h1 style="color: #6a86f2; letter-spacing: 8px;">
          ${otp}
        </h1>
        <p>This code expires in 5 minutes.</p>
      </div>
    `,
  });
};

export default sendEmail;
