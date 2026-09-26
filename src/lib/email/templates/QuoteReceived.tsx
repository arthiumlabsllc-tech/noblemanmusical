import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text, Tailwind,
} from "@react-email/components";

interface QuoteReceivedEmailProps {
  orgName: string;
  orgType: string;
  contactName: string;
  message: string;
}

export function QuoteReceivedEmail({ orgName, orgType, contactName, message }: QuoteReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New B2B quote request from {orgName}</Preview>
      <Tailwind config={{ theme: { extend: { colors: { navy: "#0B1B3B", "navy-deep": "#060F24", gold: "#D4AF37", cream: "#F5F0E6" } } } }}>
        <Body className="bg-cream font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <div className="mb-6 rounded-lg bg-navy-deep p-6 text-center">
              <Heading className="text-xl text-cream" style={{ fontFamily: "Playfair Display, serif" }}>New Quote Request</Heading>
              <Text className="mt-2 text-sm text-gold">{orgType.charAt(0).toUpperCase() + orgType.slice(1)}</Text>
            </div>
            <Text className="mb-2 text-sm text-gray-700"><strong>Organization:</strong> {orgName}</Text>
            <Text className="mb-2 text-sm text-gray-700"><strong>Contact:</strong> {contactName}</Text>
            <Text className="mb-4 text-sm text-gray-700"><strong>Message:</strong></Text>
            <Text className="mb-4 rounded-lg bg-white p-4 text-sm text-gray-700 italic">{message}</Text>
            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">Nobleman Musical Center — Admin Notification</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export default QuoteReceivedEmail;
