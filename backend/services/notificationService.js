const nodemailer = require('nodemailer');
const twilio     = require('twilio');

// ── Email Transporter (Gmail) ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Twilio SMS Client ──────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ── Helper: Send Email ─────────────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Complaint System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Email Error: ${err.message}`);
  }
};

// ── Helper: Send SMS ───────────────────────────────────────────────────────
const sendSMS = async (to, body) => {
  try {
    // Ensure phone number is in E.164 format e.g. +919876543210
    const formattedPhone = to.startsWith('+') ? to : `+91${to}`;
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:   formattedPhone,
    });
    console.log(`✅ SMS sent to ${formattedPhone}`);
  } catch (err) {
    console.error(`❌ SMS Error: ${err.message}`);
  }
};

// ── Notify: Complaint Registered ──────────────────────────────────────────
const notifyComplaintRegistered = async (user, complaint) => {
  const subject = `✅ Complaint Registered — ID: ${complaint._id}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
      <div style="background:#1E3A5F;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Complaint Registered Successfully</h1>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">Hello <strong>${user.name}</strong>,</p>
        <p>Your complaint has been registered. Here are the details:</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;width:40%;">Complaint ID</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint._id}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Title</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint.title}</td>
          </tr>
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Category</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint.category}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Priority</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint.priority}</td>
          </tr>
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Status</td>
            <td style="padding:10px;border:1px solid #ddd;color:orange;font-weight:bold;">${complaint.status}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Submitted On</td>
            <td style="padding:10px;border:1px solid #ddd;">${new Date(complaint.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        <p style="margin-top:20px;color:#555;">We will review your complaint and update you shortly. You will receive an SMS and email notification on every status change.</p>
        <p style="color:#555;">Thank you for reaching out!</p>
      </div>
      <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
        Complaint System &copy; ${new Date().getFullYear()}
      </div>
    </div>
  `;

  const smsBody =
    `Complaint Registered!\n` +
    `ID: ${complaint._id}\n` +
    `Title: ${complaint.title}\n` +
    `Category: ${complaint.category}\n` +
    `Status: Pending\n` +
    `We will keep you updated on every progress.`;

  await sendEmail(user.email, subject, html);
  await sendSMS(user.phone, smsBody);
};

// ── Notify: Status Updated ─────────────────────────────────────────────────
const notifyStatusUpdate = async (user, complaint) => {
  const statusColors = {
    Pending:      'orange',
    'In Progress':'#2196F3',
    Resolved:     '#4CAF50',
    Rejected:     '#F44336',
  };

  const subject = `🔔 Complaint Update — Status: ${complaint.status} | ID: ${complaint._id}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
      <div style="background:#1E3A5F;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">Complaint Status Updated</h1>
      </div>
      <div style="padding:24px;">
        <p style="font-size:16px;">Hello <strong>${user.name}</strong>,</p>
        <p>Your complaint status has been updated. Here are the latest details:</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;width:40%;">Complaint ID</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint._id}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Title</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint.title}</td>
          </tr>
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">New Status</td>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;color:${statusColors[complaint.status] || '#333'};">${complaint.status}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Admin Comment</td>
            <td style="padding:10px;border:1px solid #ddd;">${complaint.adminComment || 'No comment provided'}</td>
          </tr>
          ${complaint.resolvedAt ? `
          <tr style="background:#f0f4f8;">
            <td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Resolved On</td>
            <td style="padding:10px;border:1px solid #ddd;">${new Date(complaint.resolvedAt).toLocaleString()}</td>
          </tr>` : ''}
        </table>
        <p style="margin-top:20px;color:#555;">If you have further questions, feel free to submit a new complaint or contact support.</p>
      </div>
      <div style="background:#f5f5f5;padding:12px;text-align:center;font-size:12px;color:#999;">
        Complaint System &copy; ${new Date().getFullYear()}
      </div>
    </div>
  `;

  const smsBody =
    `Complaint Update!\n` +
    `ID: ${complaint._id}\n` +
    `Title: ${complaint.title}\n` +
    `New Status: ${complaint.status}\n` +
    (complaint.adminComment ? `Admin Note: ${complaint.adminComment}\n` : '') +
    `Thank you for your patience.`;

  await sendEmail(user.email, subject, html);
  await sendSMS(user.phone, smsBody);
};

module.exports = { notifyComplaintRegistered, notifyStatusUpdate };
