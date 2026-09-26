import {
  Hero,
  FeaturedCategories,
  FeaturedProducts,
  B2BSection,
  Testimonials,
  BrandStory,
  NewsletterCTA,
} from "@/components/home";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <B2BSection />
      <BrandStory />
      <Testimonials />
      <NewsletterCTA />
    </main>
  );
}
