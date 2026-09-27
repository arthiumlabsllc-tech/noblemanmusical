import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content/blog";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Nobleman Musical Center",
  description: "Guides, tips, and news about musical instruments in Ghana.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-cream pt-chrome">
      {/* Hero */}
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <BookOpen className="h-7 w-7 text-gold" />
            </div>
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold text-cream md:text-4xl">
            The Nobleman Blog
          </h1>
          <p className="text-sm text-cream/60">
            Guides, tips, and insights for musicians in Ghana.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-cream-dark bg-white transition hover:border-gold/30 hover:shadow-md"
            >
              <div className="h-40 bg-gradient-to-br from-navy-deep to-navy flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-gold/30" />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-charcoal/60">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="mb-2 font-display text-lg font-bold text-navy-deep group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="mb-3 text-sm text-charcoal/60 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-charcoal/60">{post.author}</p>
                  <ArrowRight className="h-4 w-4 text-charcoal/60 transition group-hover:text-gold group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
