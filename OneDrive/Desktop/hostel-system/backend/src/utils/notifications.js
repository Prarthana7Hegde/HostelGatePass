const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, link) => {
  const html = `
    <h2>Hostel Gate Pass Approval</h2>
    <p>A student has requested gate pass. Please respond:</p>

    <a href="${link}&action=approve" style="color:green;font-size:18px;">
      ✅ APPROVE PASS
    </a>
    <br><br>
    <a href="${link}&action=reject" style="color:red;font-size:18px;">
      ❌ REJECT PASS
    </a>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });

    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};
