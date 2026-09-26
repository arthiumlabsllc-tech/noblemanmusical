"use client";

import { MessageCircle } from "lucide-react";
import { whatsappOrderLink } from "@/lib/whatsapp/client";
import { formatGHS } from "@/lib/utils";

interface WhatsAppOrderButtonProps {
  productName: string;
  productSlug: string;
  price: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Client-side WhatsApp order button.
 * Opens wa.me with a pre-filled order message.
 */
export function WhatsAppOrderButton({
  productName,
  productSlug,
  price,
  className = "",
  size = "md",
}: WhatsAppOrderButtonProps) {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const productUrl = `${appUrl}/product/${productSlug}`;

  const href = whatsappOrderLink({
    productName,
    productUrl,
    price: formatGHS(price),
  });

  const sizeClasses = {
    sm: "gap-1.5 rounded-md px-3 py-1.5 text-xs",
    md: "gap-2 rounded-lg px-4 py-2.5 text-sm",
    lg: "gap-2 rounded-lg px-6 py-3 text-base",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center font-medium text-kente-green transition hover:bg-kente-green/10 ${sizeClasses[size]} ${className}`}
      aria-label={`Order ${productName} via WhatsApp`}
    >
      <MessageCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Order via WhatsApp
    </a>
  );
}
