import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";

interface NewsletterWelcomeProps {
  /** Absolute storefront URL — the shopper came from a footer input, so give them a way back in. */
  shopUrl: string;
  contactUrl: string;
  /** Physical address. CAN-SPAM/GDPR-style opt-out text needs a real reply route. */
  mailingLine: string;
}

/**
 * Welcome email for a newsletter signup.
 *
 * Separate from `WelcomeEmail` (the account-creation email) on purpose: that one
 * greets a named customer about their new account, this one greets an anonymous
 * address that asked for a mailing list. Merging them would mean inventing a
 * `name` for someone who never gave one.
 *
 * The opt-out line is not decoration. A marketing email that does not say how to
 * stop it is the complaint that gets a sending domain rate-limited, and the
 * footer form is the first place this business will ever acquire addresses at
 * scale.
 */
export function NewsletterWelcome({
  shopUrl,
  contactUrl,
  mailingLine,
}: NewsletterWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the list — here&apos;s what you&apos;ll get</Preview>
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
              <Text
                className="text-2xl font-bold text-navy-deep"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                NOBLEMAN
              </Text>
              <Text
                className="text-xs tracking-widest text-navy"
                style={{ letterSpacing: 6 }}
              >
                MUSICAL CENTER
              </Text>
            </div>

            <div className="mb-6 rounded-lg bg-navy-deep p-6 text-center">
              <Heading
                className="text-xl text-cream"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Welcome to the Nobleman Circle
              </Heading>
              <Text className="mt-2 text-sm italic text-gold">
                Where Music Meets Majesty
              </Text>
            </div>

            <Text className="mb-4 text-sm text-gray-700">
              You asked to hear about new arrivals, exclusive deals and events —
              so that is exactly what you&apos;ll get. No daily mail, no filler.
            </Text>

            <Text className="mb-2 text-sm font-semibold text-navy-deep">
              What to expect
            </Text>
            <ul className="mb-6 ml-4 list-disc text-sm text-gray-700">
              <li className="mb-1">New instruments as they land in the Accra showroom</li>
              <li className="mb-1">Closeouts and bundles before they reach the shop page</li>
              <li>Notes for churches, studios and schools on buying gear together</li>
            </ul>

            <div className="mb-6 rounded-lg border border-gold/40 p-4 text-center">
              <Link
                href={shopUrl}
                className="text-sm font-semibold text-navy-deep"
                style={{ textDecoration: "none" }}
              >
                Browse the collection →
              </Link>
            </div>

            <Hr className="my-6 border-gray-200" />
            <Text className="text-xs text-gray-400">
              Prefer not to receive these?{" "}
              <Link href={contactUrl} className="text-gray-500">
                Reply here
              </Link>{" "}
              and we&apos;ll remove your address — no account to find, no
              confirmation needed.
            </Text>
            <Text className="mt-3 text-center text-xs text-gray-400">
              {mailingLine}
              <br />
              Where Music Meets Majesty
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default NewsletterWelcome;
