import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Nobleman Circle!</Preview>
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
                Welcome to the Nobleman Circle
              </Heading>
              <Text className="mt-2 text-sm italic text-gold">
                Where Music Meets Majesty
              </Text>
            </div>

            <Text className="mb-4 text-sm text-gray-700">
              Hi {name}, welcome to Nobleman Musical Center — Ghana&apos;s premier house of musical instruments.
            </Text>

            <Text className="mb-4 text-sm text-gray-700">
              As a member, you&apos;ll get early access to new arrivals, exclusive discounts, and priority support for all your musical needs.
            </Text>

            <Text className="mb-4 text-sm text-gray-700">
              Whether you&apos;re a church musician, a radio professional, a student, or a passionate player — we&apos;re here to help you find your sound.
            </Text>

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

export default WelcomeEmail;
