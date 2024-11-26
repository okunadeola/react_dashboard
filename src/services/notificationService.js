import toast from 'react-hot-toast'

export const notificationService = {
  // Email templates
  templates: {
    fileShared: ({ fileName, sharedBy, recipients, message, expiryDate }) => ({
      subject: `${sharedBy} shared a file with you: ${fileName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>File Shared with You</h2>
          <p>${sharedBy} has shared a file with you.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>File:</strong> ${fileName}</p>
            ${message ? `<p style="margin: 8px 0;"><strong>Message:</strong> ${message}</p>` : ''}
            ${expiryDate ? `<p style="margin: 8px 0;"><strong>Expires:</strong> ${expiryDate}</p>` : ''}
          </div>
          <a href="#" style="display: inline-block; background: #2d7ff9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            View File
          </a>
        </div>
      `
    }),
    accessGranted: ({ fileName, grantedBy, permissions }) => ({
      subject: `${grantedBy} granted you ${permissions} access to ${fileName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Access Granted</h2>
          <p>You now have ${permissions} access to ${fileName}.</p>
          <a href="#" style="display: inline-block; background: #2d7ff9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Open File
          </a>
        </div>
      `
    })
  },

  // Send email notification
  sendEmailNotification: async (template, data) => {
    try {
      // In a real app, you would make an API call to your email service
      // For demo purposes, we'll just show a toast
      console.log('Sending email:', template(data))
      toast.success('Email notification sent')
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send email notification')
      return false
    }
  },

  // Send in-app notification
  sendInAppNotification: async (userId, notification) => {
    try {
      // In a real app, you would store this in your database
      console.log('Sending in-app notification:', notification)
      return true
    } catch (error) {
      console.error('Failed to send in-app notification:', error)
      return false
    }
  }
} 