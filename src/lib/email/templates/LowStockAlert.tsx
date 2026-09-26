import {
  Body, Container, Head, Heading, Hr, Html, Preview, Text, Tailwind,
} from "@react-email/components";

interface LowStockAlertEmailProps {
  products: Array<{ name: string; currentStock: number; threshold: number }>;
}

export function LowStockAlertEmail({ products }: LowStockAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Low stock alert — ${products.length} product(s) need restocking`}</Preview>
      <Tailwind config={{ theme: { extend: { colors: { navy: "#0B1B3B", "navy-deep": "#060F24", gold: "#D4AF37", cream: "#F5F0E6", "kente-red": "#C1272D" } } } }}>
        <Body className="bg-cream font-sans">
          <Container className="mx-auto max-w-lg p-6">
            <div className="mb-6 rounded-lg bg-kente-red p-4 text-center">
              <Heading className="text-lg text-cream">Low Stock Alert</Heading>
              <Text className="mt-1 text-sm text-cream/80">{products.length} product(s) below threshold</Text>
            </div>
            {products.map((p, i) => (
              <div key={i} className="mb-2 rounded-lg border border-gray-200 bg-white p-3">
                <Text className="m-0 text-sm font-medium text-gray-800">{p.name}</Text>
                <Text className="m-0 text-xs text-kente-red">
                  Stock: {p.currentStock} / Threshold: {p.threshold}
                </Text>
              </div>
            ))}
            <Hr className="my-6 border-gray-200" />
            <Text className="text-center text-xs text-gray-400">Nobleman Musical Center — Inventory Alert</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
export default LowStockAlertEmail;
