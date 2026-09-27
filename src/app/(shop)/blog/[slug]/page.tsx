import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import { JsonLd } from "@/components/seo/json-ld";
import { blogPostingLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { sanitizeHtml } from "@/lib/utils/sanitize";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Post Not Found", robots: { index: false, follow: false } };
  }

  const canonical = `/blog/${post.slug}`;
  return {
    // The root template already appends the site name; "— Nobleman Blog" on top
    // of it pushed long titles past the truncation point.
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, "musical instruments Ghana", "music tips Accra"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonical,
      publishedTime: post.date,
      modifiedTime: post.date,
      // `authors`, not `author` — this mirrors the metadata root field name and
      // is emitted as og:article:author.
      authors: [post.author],
      section: post.category,
      tags: [post.category],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Simple markdown-like rendering
  const contentHtml = post.content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return `<h2 class="mt-8 mb-4 font-display text-xl font-bold text-navy-deep">${trimmed.slice(3)}</h2>`;
      if (trimmed.startsWith("### ")) return `<h3 class="mt-6 mb-3 text-lg font-bold text-navy-deep">${trimmed.slice(4)}</h3>`;
      if (trimmed.startsWith("- ")) return `<li class="ml-4 text-charcoal/70">• ${trimmed.slice(2)}</li>`;
      if (trimmed.startsWith("| ")) return null; // Skip table rows for simplicity
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) return `<p class="font-semibold text-navy-deep">${trimmed.slice(2, -2)}</p>`;
      // Handle inline bold
      const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy-deep">$1</strong>');
      return `<p class="text-charcoal/70 leading-relaxed">${withBold}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return (
    <article className="min-h-screen bg-cream pt-chrome">
      <JsonLd
        data={[
          blogPostingLd(post),
          breadcrumbLd([
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      {/* Hero */}
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-cream/60 hover:text-cream">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-cream/60"><Clock className="h-3 w-3" />{post.readTime}</span>
          </div>
          <h1 className="mb-4 font-display text-3xl font-bold text-cream md:text-4xl">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-cream/50">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
            <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="prose-custom" dangerouslySetInnerHTML={{ __html: sanitizeHtml(contentHtml) }} />

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-navy-deep p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-gold/40" />
          <h3 className="mb-2 font-display text-xl font-bold text-cream">Need Expert Advice?</h3>
          <p className="mb-4 text-sm text-cream/60">Visit Nobleman Musical Center in Accra or reach out on WhatsApp.</p>
          <Link href="/contact" className="inline-flex rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light">
            Contact Us
          </Link>
        </div>
      </div>
    </article>
  );
}
