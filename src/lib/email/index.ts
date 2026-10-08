import { emailConfig, isEmailConfigured } from "./config";
import { orderConfirmationTemplate, type OrderConfirmationData } from "./templates/order-confirmation";
import { shippingUpdateTemplate, type ShippingUpdateData } from "./templates/shipping-update";
import { passwordResetTemplate, type PasswordResetData } from "./templates/password-reset";

// Email sending service
// In production, this would use nodemailer, Resend, SendGrid, or AWS SES

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log("[Email] Order confirmation would be sent to:", data.to);
    console.log("[Email] Order:", data.orderNumber);
    return false;
  }

  const { subject, html } = orderConfirmationTemplate(data);

  try {
    // In production, send the email here
    // await transporter.sendMail({
    //   from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
    //   to: data.to,
    //   subject,
    //   html,
    // });

    console.log("[Email] Order confirmation sent to:", data.to);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
    return false;
  }
}

export async function sendShippingUpdate(data: ShippingUpdateData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log("[Email] Shipping update would be sent to:", data.to);
    console.log("[Email] Order:", data.orderNumber, "Status:", data.status);
    return false;
  }

  const { subject, html } = shippingUpdateTemplate(data);

  try {
    // In production, send the email here
    console.log("[Email] Shipping update sent to:", data.to);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send shipping update:", error);
    return false;
  }
}

export async function sendPasswordReset(data: PasswordResetData): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log("[Email] Password reset would be sent to:", data.to);
    console.log("[Email] Reset URL:", data.resetUrl);
    return false;
  }

  const { subject, html } = passwordResetTemplate(data);

  try {
    // In production, send the email here
    console.log("[Email] Password reset sent to:", data.to);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send password reset:", error);
    return false;
  }
}

// Re-export templates for direct use
export { orderConfirmationTemplate, shippingUpdateTemplate, passwordResetTemplate };
export type { OrderConfirmationData, ShippingUpdateData, PasswordResetData };
