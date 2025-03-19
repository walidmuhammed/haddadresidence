import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const sendWelcomeEmail = async (userEmail: string) => {
  const html = `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color:#a89166;">Welcome to Haddad Residence!</h1>
      <p>Thank you for registering for early access to our platform.</p>
      <h2>Registration Details</h2>
      <p>Your email: ${userEmail}</p>
      <p>Registration date: ${new Date().toLocaleDateString()}</p>
      <h2>Next Steps</h2>
      <ul>
        <li>Watch for our launch announcement in the coming weeks</li>
        <li>You'll be among the first to access our platform</li>
        <li>Exclusive early-bird benefits will be announced soon</li>
      </ul>
      <h2>Need Help?</h2>
      <p>If you have any questions, please contact our support team at info@HaddadResidence.com</p>
      <hr style="margin: 20px 0;" />
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "", // Use verified domain email
      to: userEmail,
      subject: "Welcome to Haddad Residence Platform",
      messageId: `<${Date.now()}-welcome@mhaddadresidence.com>`,
      headers: {
        Precedence: "bulk",
      },
      html,
      text: `
Welcome to Haddad Residence!

Thank you for registering for early access to our platform.

Registration Details
- Your email: ${userEmail}
- Registration date: ${new Date().toLocaleDateString()}

Next Steps
- Watch for our launch announcement in the coming weeks
- You'll be among the first to access our platform
- Exclusive early-bird benefits will be announced soon

Need Help?
If you have any questions, please contact our support team at info@HaddadResidence.com

    `,
    });
    console.log("Welcome email sent:", info.messageId, "to:", userEmail);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};

export const sendAdminNotification = async (userEmail: string) => {
  const html = `
    <div style="font-family: Montserrat, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #a89166;">New Subscriber Registration</h1>
      <h2>Registration Details</h2>
      <ul>
        <li>Email: ${userEmail}</li>
        <li>Timestamp: ${new Date().toISOString()}</li>
        <li>Source: Website Early Registration</li>
        <li>Platform: Landing Page</li>
      </ul>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "", // Use verified domain email
      to: process.env.ADMIN_EMAIL,
      subject: `New Registration: ${userEmail}`,
      messageId: `<${Date.now()}-admin@mhaddadresidence.com>`,
      priority: "high",
      html,
      text: `
New Subscriber Registration

Registration Details:
- Email: ${userEmail}
- Timestamp: ${new Date().toISOString()}
- Source: Website Early Registration
- Platform: Landing Page
    `,
    });
    console.log(
      "Admin notification sent:",
      info.messageId,
      "to:",
      process.env.ADMIN_EMAIL
    );
    return info;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    throw error;
  }
};
