import type { Metadata } from "next";
import { B2BPageLayout } from "@/components/b2b/b2b-page-layout";

export const metadata: Metadata = { title: "Solutions for Churches", description: "Complete sound solutions for worship — PA systems, keyboards, microphones, and more. Bulk pricing for churches in Ghana." };

export default function ChurchesPage() {
  return (
    <B2BPageLayout
      title="Sound Solutions for Churches"
      subtitle="For Houses of Worship"
      description="From small chapels to large congregations, Nobleman Musical Center provides complete worship sound solutions. We understand the unique audio needs of churches in Ghana — from powerful praise & worship setups to clear speech reproduction for sermons."
      orgType="church"
      benefits={[
        "Custom PA system design for your sanctuary size and acoustics",
        "Wireless microphone systems for pastors and worship leaders",
        "Keyboard and organ packages for worship teams",
        "Bulk pricing and flexible payment plans for churches",
        "Free installation and training for your sound team",
        "Ongoing support and maintenance packages",
      ]}
    />
  );
}
