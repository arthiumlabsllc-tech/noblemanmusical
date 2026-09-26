import type { Metadata } from "next";
import { B2BPageLayout } from "@/components/b2b/b2b-page-layout";

export const metadata: Metadata = { title: "Solutions for Schools", description: "Quality musical instruments for schools in Ghana. Special educational pricing and package deals for music programs." };

export default function SchoolsPage() {
  return (
    <B2BPageLayout
      title="Instruments for Schools"
      subtitle="For Music Education"
      description="Bring music education to life with quality instruments from Nobleman Musical Center. We offer special educational pricing and durable instruments perfect for school music programs, from primary to university level."
      orgType="school"
      benefits={[
        "Special educational pricing for qualified institutions",
        "Durable instruments designed for student use",
        "Class sets of recorders, keyboards, and percussion",
        "Music room setup consultation and planning",
        "Teacher training workshops on instrument care",
        "Annual maintenance and replacement programs",
      ]}
    />
  );
}
