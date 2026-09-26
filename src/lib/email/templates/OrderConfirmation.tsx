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
  Column,
  Row,
  Link,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: string }>;
  subtotal: string;
  deliveryFee: string;
  total: string;
  deliveryEta: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  subtotal,
  deliveryFee,
  total,
  deliveryEta,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Nobleman Musical Center order {orderNumber} is confirmed!</Preview>
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
            {/* Header */}
            <div className="mb-8 text-center">
              <Text className="text-2xl font-bold text-navy-deep" style={{ fontFamily: "Playfair Display, serif" }}>
                NOBLEMAN
              </Text>
              <Text className="text-xs tracking-widest text-navy" style={{ letterSpacing: 6 }}>
                MUSICAL CENTER
              </Text>
            </div>

            {/* Success message */}
            <div className="mb-6 rounded-lg bg-navy-deep p-6 text-center">
              <Heading className="text-xl text-cream" style={{ fontFamily: "Playfair Display, serif" }}>
                Order Confirmed!
              </Heading>
              <Text className="mt-2 text-sm text-gold">
                Order #{orderNumber}
              </Text>
            </div>

            <Text className="mb-4 text-sm text-gray-700">
              Hi {customerName}, thank you for your order! We&apos;re preparing your instruments with care.
            </Text>

            {/* Items table */}
            <Section className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
              <Heading as="h3" className="mb-3 text-sm font-bold text-navy-deep">
                Order Items
              </Heading>
              {items.map((item, i) => (
                <Row key={i} className="mb-2">
                  <Column>
                    <Text className="m-0 text-sm text-gray-700">
                      {item.name} × {item.quantity}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text className="m-0 text-sm text-gray-700">{item.price}</Text>
                  </Column>
                </Row>
              ))}
              <Hr className="my-3 border-gray-200" />
              <Row>
                <Column>
                  <Text className="m-0 text-sm text-gray-500">Subtotal</Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm text-gray-700">{subtotal}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="m-0 text-sm text-gray-500">Delivery</Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm text-gray-700">{deliveryFee}</Text>
                </Column>
              </Row>
              <Hr className="my-3 border-gray-200" />
              <Row>
                <Column>
                  <Text className="m-0 text-sm font-bold text-navy-deep">Total</Text>
                </Column>
                <Column align="right">
                  <Text className="m-0 text-sm font-bold text-navy-deep">{total}</Text>
                </Column>
              </Row>
            </Section>

            {/* Delivery ETA */}
            <Text className="mb-4 text-sm text-gray-600">
              Estimated delivery: <strong>{deliveryEta}</strong>
            </Text>

            {/* WhatsApp CTA */}
            <Section className="my-6 text-center">
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"}?text=${encodeURIComponent(`Hi, I have a question about order ${orderNumber}`)}`}
                className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep no-underline"
              >
                Contact via WhatsApp
              </Link>
            </Section>

            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">
              Nobleman Musical Center — Accra, Ghana
              <br />
              Where Music Meets Majesty
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default OrderConfirmationEmail;
