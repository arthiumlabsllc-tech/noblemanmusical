import { emailConfig } from "../config";

export type OrderConfirmationData = {
  to: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    region: string;
  };
};

export function orderConfirmationTemplate(data: OrderConfirmationData): { subject: string; html: string } {
  const subject = `Order Confirmation #${data.orderNumber}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
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
              <p style="margin: 8px 0 0; color: #ffffff; font-size: 14px;">Where Music Meets Majesty</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 24px; font-weight: 700;">
                Thank you for your order, ${data.customerName}!
              </h2>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                Your order <strong>#${data.orderNumber}</strong> has been confirmed and is being processed.
              </p>

              <!-- Order details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf9f6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 16px; color: #1a1a2e; font-size: 16px; font-weight: 600;">Order Details</h3>
                    <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                      <strong>Order Number:</strong> #${data.orderNumber}
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px;">
                      <strong>Order Date:</strong> ${data.orderDate}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px; border-bottom: 1px solid #e5e5e5;">
                    <h3 style="margin: 0; color: #1a1a2e; font-size: 16px; font-weight: 600;">Items Ordered</h3>
                  </td>
                </tr>
                ${data.items.map(item => `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="color: #1a1a2e; font-size: 14px;">${item.name} × ${item.quantity}</td>
                        <td style="text-align: right; color: #1a1a2e; font-size: 14px; font-weight: 600;">
                          GH₵${item.price.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join("")}
              </table>

              <!-- Totals -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf9f6; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; color: #4a4a4a; font-size: 14px;">Subtotal</td>
                        <td style="padding: 4px 0; text-align: right; color: #1a1a2e; font-size: 14px;">GH₵${data.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #4a4a4a; font-size: 14px;">Shipping</td>
                        <td style="padding: 4px 0; text-align: right; color: #1a1a2e; font-size: 14px;">
                          ${data.shipping === 0 ? "Free" : `GH₵${data.shipping.toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #4a4a4a; font-size: 14px;">Tax</td>
                        <td style="padding: 4px 0; text-align: right; color: #1a1a2e; font-size: 14px;">GH₵${data.tax.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 4px; border-top: 1px solid #e5e5e5; color: #1a1a2e; font-size: 18px; font-weight: 700;">Total</td>
                        <td style="padding: 12px 0 4px; border-top: 1px solid #e5e5e5; text-align: right; color: #d4af37; font-size: 18px; font-weight: 700;">
                          GH₵${data.total.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Shipping address -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #faf9f6; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px; font-weight: 600;">Shipping Address</h3>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">
                      ${data.shippingAddress.name}<br>
                      ${data.shippingAddress.address}<br>
                      ${data.shippingAddress.city}, ${data.shippingAddress.region}
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
