// controllers/email.js
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send email to employee
 * @route POST /api/email/send
 * @access Private (Admin only)
 */
export const sendEmail = async (req, res) => {
  try {
    // Extract data from request
    const { to, recipientName, subject, message } = req.body;
    const attachments = req.files || [];

    // Validate required fields
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: recipient email, subject, or message"
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Format attachments for nodemailer
    const emailAttachments = attachments.map(file => ({
      filename: file.originalname || path.basename(file.path),
      path: file.path
    }));

    // Create email options with HTML template
    const mailOptions = {
      from: {
        name: "Paneltech LLC",
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Hello ${recipientName || "Employee"},</h2>
          <div style="padding: 20px 0; line-height: 1.5;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <div style="padding-top: 20px; border-top: 1px solid #e5e7eb; margin-top: 20px; color: #6b7280;">
            <p>Best regards,<br>Paneltech LLC Admin</p>
          </div>
        </div>
      `,
      attachments: emailAttachments
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message
    });
  }
};

/**
 * Send bulk emails to multiple employees
 * @route POST /api/email/bulk
 * @access Private (Admin only)
 */
export const sendBulkEmails = async (req, res) => {
  try {
    // Extract data from request
    const { recipients, subject, message } = req.body;
    const attachments = req.files || [];

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: recipients array, subject, or message"
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Format attachments for nodemailer
    const emailAttachments = attachments.map(file => ({
      filename: file.originalname || path.basename(file.path),
      path: file.path
    }));

    // Send emails to all recipients
    const results = [];
    for (const recipient of recipients) {
      try {
        // Create email options with HTML template
        const mailOptions = {
          from: {
            name: "Paneltech LLC",
            address: process.env.EMAIL_USER
          },
          to: recipient.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Hello ${recipient.name || "Employee"},</h2>
              <div style="padding: 20px 0; line-height: 1.5;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <div style="padding-top: 20px; border-top: 1px solid #e5e7eb; margin-top: 20px; color: #6b7280;">
                <p>Best regards,<br>Paneltech LLC Admin</p>
              </div>
            </div>
          `,
          attachments: emailAttachments
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        results.push({
          email: recipient.email,
          success: true,
          messageId: info.messageId
        });
      } catch (error) {
        results.push({
          email: recipient.email,
          success: false,
          error: error.message
        });
      }
    }

    // Return results
    return res.status(200).json({
      success: true,
      message: `Sent ${results.filter(r => r.success).length} out of ${recipients.length} emails`,
      results
    });
  } catch (error) {
    console.error("Bulk email sending error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send bulk emails",
      error: error.message
    });
  }
};