// Email configuration for Nobleman Musical Center
// In production, this would use a service like Resend, SendGrid, or AWS SES

export const emailConfig = {
  from: {
    name: "Nobleman Musical Center",
    email: "noreply@noblemanmusic.com",
  },
  support: {
    name: "Nobleman Support",
    email: "support@noblemanmusic.com",
  },
  b2b: {
    name: "Nobleman B2B",
    email: "b2b@noblemanmusic.com",
  },
};

// Email provider configuration
export const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
};

// Check if email is configured
export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
