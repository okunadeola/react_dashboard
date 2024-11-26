import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const emailService = {
  init() {
    emailjs.init(PUBLIC_KEY)
  },

  async sendEmail({ to_email, to_name, subject, message, attachments = [] }) {
    try {
      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        {
          to_email,
          to_name,
          subject,
          message,
          attachments: JSON.stringify(attachments)
        }
      )

      if (response.status === 200) {
        toast.success('Email sent successfully')
        return true
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      toast.error('Failed to send email')
      return false
    }
  },

  // Email templates
  templates: {
    fileShared: ({ fileName, sharedBy, message, expiryDate, downloadUrl }) => ({
      subject: `${sharedBy} shared a file with you: ${fileName}`,
      message: `
        <div style="font-family: sans-serif;">
          <h2>File Shared with You</h2>
          <p>${sharedBy} has shared a file with you.</p>
          
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>File:</strong> ${fileName}</p>
            ${message ? `<p style="margin: 8px 0;"><strong>Message:</strong> ${message}</p>` : ''}
            ${expiryDate ? `<p style="margin: 8px 0;"><strong>Expires:</strong> ${expiryDate}</p>` : ''}
          </div>

          <a href="${downloadUrl}" 
             style="display: inline-block; background: #2d7ff9; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Download File
          </a>

          <p style="color: #666; margin-top: 24px; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    }),

    taskAssigned: ({ taskName, assignedBy, dueDate, projectName, taskUrl }) => ({
      subject: `New Task Assigned: ${taskName}`,
      message: `
        <div style="font-family: sans-serif;">
          <h2>New Task Assignment</h2>
          <p>${assignedBy} has assigned you a new task.</p>
          
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>Task:</strong> ${taskName}</p>
            <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName}</p>
            <p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>

          <a href="${taskUrl}" 
             style="display: inline-block; background: #2d7ff9; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Task Details
          </a>
        </div>
      `
    }),

    projectUpdate: ({ projectName, updateType, details, updatedBy, projectUrl }) => ({
      subject: `Project Update: ${projectName} - ${updateType}`,
      message: `
        <div style="font-family: sans-serif;">
          <h2>Project Update</h2>
          <p>${updatedBy} has made updates to ${projectName}.</p>
          
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>Update Type:</strong> ${updateType}</p>
            <p style="margin: 8px 0;"><strong>Details:</strong> ${details}</p>
          </div>

          <a href="${projectUrl}" 
             style="display: inline-block; background: #2d7ff9; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View Project
          </a>
        </div>
      `
    })
  }
} 