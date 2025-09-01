// import nodemailer from "nodemailer";
// import { config } from "../config/env";

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: config.GMAIL_USER,
// //     pass: config.GMAIL_PASS,
// //   },
// // });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // true = SSL
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function sendEmail(to: string, subject: string, html: string) {
//   try {
//     const info = await transporter.sendMail({
//       from: `"HD Notes" <${config.GMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Gmail email sent:", info.messageId);
//   } catch (err: any) {
//     console.error("❌ Gmail SMTP failed:", err.message);
//     throw new Error("Failed to send email: " + err.message);
//   }
// }
import nodemailer from "nodemailer";
import { config } from "../config/env";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true = SSL
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"HD Notes" <${config.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Gmail email sent:", info.messageId);
  } catch (err: any) {
    console.error("❌ Gmail SMTP failed:", err.message);
    throw new Error("Failed to send email: " + err.message);
  }
}
