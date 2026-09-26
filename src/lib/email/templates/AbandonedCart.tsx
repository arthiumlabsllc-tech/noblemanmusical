import {
  Body, Container, Head, Hr, Html, Preview, Section, Text, Tailwind, Link,
} from "@react-email/components";

interface AbandonedCartEmailProps {
  customerName: string;
  items: Array<{ name: string; price: string }>;
  cartUrl: string;
}

export function AbandonedCartEmail({ customerName, items, cartUrl }: AbandonedCartEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You left something behind at Nobleman Musical Center!</Preview>
      <Tailwind config={{ theme: { extend: { colors: { navy: "#0B1B3B", "navy-deep": "#060F24", gold: "#D4AF37", cream: "#F5F0E6" } } } }}>
        <Body className="bg-cream font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <div className="mb-8 text-center">
              <Text className="text-2xl font-bold text-navy-deep" style={{ fontFamily: "Playfair Display, serif" }}>NOBLEMAN</Text>
              <Text className="text-xs tracking-widest text-navy" style={{ letterSpacing: 6 }}>MUSICAL CENTER</Text>
            </div>
            <Text className="mb-4 text-sm text-gray-700">Hi {customerName},</Text>
            <Text className="mb-4 text-sm text-gray-700">You left some amazing instruments in your cart! Complete your order before they sell out.</Text>
            <Section className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
              {items.map((item, i) => (
                <Text key={i} className="mb-2 text-sm text-gray-700">{item.name} — {item.price}</Text>
              ))}
            </Section>
            <Section className="my-6 text-center">
              <Link href={cartUrl} className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep no-underline">Complete Your Order</Link>
            </Section>
            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">Nobleman Musical Center — Accra, Ghana</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export default AbandonedCartEmail;
