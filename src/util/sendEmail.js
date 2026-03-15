import nodemailer from "nodemailer";

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text
  });
};

export default sendEmail;