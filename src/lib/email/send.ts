import { render } from "@react-email/render";
import { resend, EMAIL_FROM } from "./client";
import { formatGHS } from "@/lib/utils";
import { OrderConfirmationEmail } from "./templates/OrderConfirmation";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { OrderShippedEmail } from "./templates/OrderShipped";
import { PasswordResetEmail } from "./templates/PasswordReset";
import { AbandonedCartEmail } from "./templates/AbandonedCart";
import { QuoteReceivedEmail } from "./templates/QuoteReceived";
import { LowStockAlertEmail } from "./templates/LowStockAlert";

/* ═══════════════════════════════════════════════════════════
   Typed send helpers
   ═══════════════════════════════════════════════════════════ */

export async function sendOrderConfirmation(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryEta: string;
}) {
  const html = await render(
    OrderConfirmationEmail({
      orderNumber: input.orderNumber,
      customerName: input.customerName,
      items: input.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: formatGHS(i.price),
      })),
      subtotal: formatGHS(input.subtotal),
      deliveryFee: input.deliveryFee === 0 ? "Free" : formatGHS(input.deliveryFee),
      total: formatGHS(input.total),
      deliveryEta: input.deliveryEta,
    })
  );

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: `Order Confirmed — ${input.orderNumber}`,
    html,
  });
}

export async function sendWelcome(input: { to: string; name: string }) {
  const html = await render(WelcomeEmail({ name: input.name }));

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: "Welcome to the Nobleman Circle",
    html,
  });
}

export async function sendOrderShipped(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  trackingInfo?: string;
}) {
  const html = await render(
    OrderShippedEmail({
      orderNumber: input.orderNumber,
      customerName: input.customerName,
      trackingInfo: input.trackingInfo,
    })
  );

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: `Your order ${input.orderNumber} has shipped!`,
    html,
  });
}

export async function sendPasswordReset(input: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  const html = await render(
    PasswordResetEmail({ name: input.name, resetUrl: input.resetUrl })
  );

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: "Reset your Nobleman password",
    html,
  });
}

export async function sendAbandonedCart(input: {
  to: string;
  customerName: string;
  items: Array<{ name: string; price: number }>;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const html = await render(
    AbandonedCartEmail({
      customerName: input.customerName,
      items: input.items.map((i) => ({
        name: i.name,
        price: formatGHS(i.price),
      })),
      cartUrl: `${appUrl}/cart`,
    })
  );

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: "You left something behind at Nobleman!",
    html,
  });
}

export async function sendQuoteReceived(input: {
  to: string;
  orgName: string;
  orgType: string;
  contactName: string;
  message: string;
}) {
  const html = await render(
    QuoteReceivedEmail({
      orgName: input.orgName,
      orgType: input.orgType,
      contactName: input.contactName,
      message: input.message,
    })
  );

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: `New Quote Request — ${input.orgName}`,
    html,
  });
}

export async function sendLowStockAlert(input: {
  to: string;
  products: Array<{ name: string; currentStock: number; threshold: number }>;
}) {
  const html = await render(LowStockAlertEmail({ products: input.products }));

  return resend.emails.send({
    from: EMAIL_FROM,
    to: input.to,
    subject: `Low Stock Alert — ${input.products.length} product(s)`,
    html,
  });
}
