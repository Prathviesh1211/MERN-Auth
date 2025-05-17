import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // ✅ Correct Brevo SMTP host
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
export default transporter