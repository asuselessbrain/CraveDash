export const resetPasswordHtml = (url: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f7fb; padding: 24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr>
              <td style="background-color: #0f172a; padding: 20px 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 22px; line-height: 30px; color: #ffffff;">Password Reset Request</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 24px;">
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 24px;">Hi,</p>
                <p style="margin: 0 0 20px; font-size: 15px; line-height: 24px;">
                  We received a request to reset your password. Click the button below to set a new password.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                      <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 22px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #4b5563;">
                  This link will expire in 15 minutes.
                </p>
                <p style="margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #4b5563;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin: 0 0 20px; font-size: 13px; line-height: 20px; word-break: break-all;">
                  <a href="${url}" target="_blank" style="color: #2563eb; text-decoration: underline;">${url}</a>
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 21px; color: #6b7280;">
                  If you did not request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af;">© ${new Date().getFullYear()} CraveDash. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
};