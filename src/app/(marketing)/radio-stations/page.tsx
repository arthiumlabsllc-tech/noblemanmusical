import type { Metadata } from "next";
import { B2BPageLayout } from "@/components/b2b/b2b-page-layout";

export const metadata: Metadata = { title: "Solutions for Radio Stations", description: "Professional broadcast equipment for radio stations in Ghana. Studio monitors, microphones, mixers, and accessories." };

export default function RadioStationsPage() {
  return (
    <B2BPageLayout
      title="Equipment for Radio Stations"
      subtitle="For Broadcast Professionals"
      description="Equip your radio station with professional-grade broadcast equipment. From studio microphones to mixing consoles and monitoring systems, we supply the tools that keep Ghana's airwaves alive."
      orgType="radio"
      benefits={[
        "Broadcast-grade microphones and headphones",
        "Studio mixing consoles and audio processors",
        "Studio monitors for accurate sound reproduction",
        "Complete studio setup and calibration services",
        "Trade-in programs for equipment upgrades",
        "Priority support and fast replacement for on-air equipment",
      ]}
    />
  );
}
