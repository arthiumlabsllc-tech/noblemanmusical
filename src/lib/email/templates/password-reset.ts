import { emailConfig } from "../config";

export type PasswordResetData = {
  to: string;
  customerName: string;
  resetUrl: string;
  expiresAt: string;
};

export function passwordResetTemplate(data: PasswordResetData): { subject: string; html: string } {
  const subject = "Reset your Nobleman password";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #d4af37; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700;">
                Nobleman Musical Center
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 24px; font-weight: 700;">
                Password Reset Request
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                Hi ${data.customerName},
              </p>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password. Click the button below to choose a new password:
              </p>

              <!-- Reset button -->
              <table role="presentation" style="width: 100%; margin: 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${data.resetUrl}" style="display: inline-block; padding: 16px 40px; background-color: #d4af37; color: #1a1a2e; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 14px; line-height: 1.5;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px; word-break: break-all;">
                <a href="${data.resetUrl}" style="color: #d4af37; font-size: 14px; text-decoration: none;">
                  ${data.resetUrl}
                </a>
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff3cd; border-radius: 8px; border: 1px solid #ffc107;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                      <strong>⚠️ This link expires on ${data.expiresAt}.</strong><br>
                      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf9f6; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                Need help? Contact us at <a href="mailto:${emailConfig.support.email}" style="color: #d4af37; text-decoration: none;">${emailConfig.support.email}</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © 2024 Nobleman Musical Center. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}
