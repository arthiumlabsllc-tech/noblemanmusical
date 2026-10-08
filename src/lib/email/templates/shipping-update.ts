import { emailConfig } from "../config";

export type ShippingUpdateData = {
  to: string;
  customerName: string;
  orderNumber: string;
  status: "processing" | "shipped" | "delivered";
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
};

export function shippingUpdateTemplate(data: ShippingUpdateData): { subject: string; html: string } {
  const statusMessages = {
    processing: {
      subject: `Your order #${data.orderNumber} is being prepared`,
      title: "Your order is being prepared!",
      message: "We're carefully packaging your items. You'll receive another email when your order ships.",
      color: "#4a90d9",
    },
    shipped: {
      subject: `Your order #${data.orderNumber} has shipped!`,
      title: "Your order is on its way!",
      message: "Great news! Your order has been shipped and is on its way to you.",
      color: "#d97706",
    },
    delivered: {
      subject: `Your order #${data.orderNumber} has been delivered`,
      title: "Your order has been delivered!",
      message: "Your order has been successfully delivered. We hope you enjoy your purchase!",
      color: "#16a34a",
    },
  };

  const statusInfo = statusMessages[data.status];
  const subject = statusInfo.subject;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Update</title>
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
              <!-- Status badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; padding: 8px 20px; background-color: ${statusInfo.color}; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 20px; text-transform: uppercase;">
                  ${data.status}
                </span>
              </div>

              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 24px; font-weight: 700; text-align: center;">
                ${statusInfo.title}
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5; text-align: center;">
                ${statusInfo.message}
              </p>

              <!-- Order info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf9f6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                      <strong>Order Number:</strong> #${data.orderNumber}
                    </p>
                    ${data.trackingNumber ? `
                    <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                      <strong>Tracking Number:</strong> ${data.trackingNumber}
                    </p>
                    ` : ""}
                    ${data.estimatedDelivery ? `
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px;">
                      <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
                    </p>
                    ` : ""}
                  </td>
                </tr>
              </table>

              ${data.trackingUrl ? `
              <!-- Track button -->
              <table role="presentation" style="width: 100%; margin: 24px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${data.trackingUrl}" style="display: inline-block; padding: 14px 32px; background-color: #d4af37; color: #1a1a2e; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px;">
                      Track Your Order
                    </a>
                  </td>
                </tr>
              </table>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf9f6; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                Questions? Contact us at <a href="mailto:${emailConfig.support.email}" style="color: #d4af37; text-decoration: none;">${emailConfig.support.email}</a>
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
