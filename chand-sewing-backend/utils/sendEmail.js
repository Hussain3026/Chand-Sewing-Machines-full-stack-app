const nodemailer = require("nodemailer");

let transporterPromise;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log("[Email] Using Gmail SMTP:", process.env.EMAIL_USER);
        return nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      }

      console.log("[Email] No email credentials found — using Ethereal (test emails).");
      console.log("[Email] OTP emails can be viewed at the URL printed after server starts.\n");
      const testAccount = await nodemailer.createTestAccount();
      console.log("[Email] Ethereal login:", testAccount.user);
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    })();
  }
  return transporterPromise;
}

const sendEmail = async ({ to, subject, html }) => {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: `"Chand Sewing Machines" <${process.env.EMAIL_USER || "test@ethereal.email"}>`,
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("[Email] Preview OTP email here:", previewUrl);
  }

  return info;
};

module.exports = sendEmail;
