const nodemailer = require('nodemailer');

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT || 587) === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const sendComplaintCompletionEmail = async (studentEmail, complaint) => {
  if (!studentEmail) {
    console.log('[Email] No student email available for completion notice.');
    return;
  }

  const transporter = createTransporter();

  if (!transporter) {
    console.log('[Email] Completion email skipped because EMAIL_USER and EMAIL_PASS are not configured.');
    return;
  }

  const subject = `Your complaint has been completed: ${complaint.title}`;
  const text = `Hello,\n\nYour complaint titled "${complaint.title}" has been marked as ${complaint.status}.\n\nStatus: ${complaint.status}\nCategory: ${complaint.category}\nLocation: ${complaint.location}\n\n${complaint.resolutionDetails ? `Resolution details: ${complaint.resolutionDetails}\n\n` : ''}Thank you for using Campus Resolve.\n`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #0f172a;">Complaint Completed</h2>
      <p>Hello,</p>
      <p>Your complaint titled <strong>${complaint.title}</strong> has been marked as <strong>${complaint.status}</strong>.</p>
      <ul>
        <li><strong>Category:</strong> ${complaint.category}</li>
        <li><strong>Location:</strong> ${complaint.location}</li>
      </ul>
      ${complaint.resolutionDetails ? `<p><strong>Resolution details:</strong><br>${complaint.resolutionDetails}</p>` : ''}
      <p>Thank you for using Campus Resolve.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Campus Resolve" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject,
      text,
      html,
    });

    console.log(`[Email] Completion notification sent to ${studentEmail}`);
  } catch (error) {
    console.error('[Email] Failed to send completion email:', error.message);
  }
};

module.exports = {
  sendComplaintCompletionEmail,
};
