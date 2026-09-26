import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";

interface OrderShippedEmailProps {
  orderNumber: string;
  customerName: string;
  trackingInfo?: string;
}

export function OrderShippedEmail({
  orderNumber,
  customerName,
  trackingInfo,
}: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been shipped!</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                navy: "#0B1B3B",
                "navy-deep": "#060F24",
                gold: "#D4AF37",
                cream: "#F5F0E6",
              },
            },
          },
        }}
      >
        <Body className="bg-cream font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <div className="mb-8 text-center">
              <Text className="text-2xl font-bold text-navy-deep" style={{ fontFamily: "Playfair Display, serif" }}>
                NOBLEMAN
              </Text>
              <Text className="text-xs tracking-widest text-navy" style={{ letterSpacing: 6 }}>
                MUSICAL CENTER
              </Text>
            </div>

            <div className="mb-6 rounded-lg bg-navy-deep p-6 text-center">
              <Heading className="text-xl text-cream" style={{ fontFamily: "Playfair Display, serif" }}>
                Your Order is on its Way!
              </Heading>
              <Text className="mt-2 text-sm text-gold">
                Order #{orderNumber}
              </Text>
            </div>

            <Text className="mb-4 text-sm text-gray-700">
              Hi {customerName}, great news! Your order has been shipped and is on its way to you.
            </Text>

            {trackingInfo && (
              <Text className="mb-4 text-sm text-gray-700">
                Tracking: <strong>{trackingInfo}</strong>
              </Text>
            )}

            <Section className="my-6 text-center">
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"}?text=${encodeURIComponent(`Hi, I'm expecting delivery of order ${orderNumber}`)}`}
                className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep no-underline"
              >
                Track via WhatsApp
              </Link>
            </Section>

            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">
              Nobleman Musical Center — Accra, Ghana
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default OrderShippedEmail;
