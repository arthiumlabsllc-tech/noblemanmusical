import {
  Body, Container, Head, Hr, Html, Preview, Section, Text, Tailwind, Link,
} from "@react-email/components";

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Nobleman Musical Center password</Preview>
      <Tailwind config={{ theme: { extend: { colors: { navy: "#0B1B3B", "navy-deep": "#060F24", gold: "#D4AF37", cream: "#F5F0E6" } } } }}>
        <Body className="bg-cream font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <div className="mb-8 text-center">
              <Text className="text-2xl font-bold text-navy-deep" style={{ fontFamily: "Playfair Display, serif" }}>NOBLEMAN</Text>
              <Text className="text-xs tracking-widest text-navy" style={{ letterSpacing: 6 }}>MUSICAL CENTER</Text>
            </div>
            <Text className="mb-4 text-sm text-gray-700">Hi {name},</Text>
            <Text className="mb-4 text-sm text-gray-700">We received a request to reset your password. Click the button below to choose a new password.</Text>
            <Section className="my-6 text-center">
              <Link href={resetUrl} className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep no-underline">Reset Password</Link>
            </Section>
            <Text className="mb-4 text-xs text-gray-400">This link expires in 1 hour. If you didn&apos;t request a reset, you can safely ignore this email.</Text>
            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">Nobleman Musical Center — Accra, Ghana</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export default PasswordResetEmail;
