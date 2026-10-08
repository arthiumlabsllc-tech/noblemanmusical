"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/star-rating";
import ReviewForm from "@/components/product/review-form";

type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  recommend: boolean;
};

type ReviewsSectionProps = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export default function ReviewsSection({ reviews, averageRating, totalReviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest" | "helpful">("recent");
  const [showForm, setShowForm] = useState(false);

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === stars).length / totalReviews) * 100 : 0,
  }));

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    if (sortBy === "helpful") return b.helpful - a.helpful;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-navy">Customer Reviews</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-gold px-4 py-2 text-sm font-bold text-navy hover:bg-gold-light"
        >
          Write a Review
        </button>
      </div>

      {/* Rating summary */}
      <div className="grid gap-8 rounded-lg border border-charcoal/10 bg-white p-6 lg:grid-cols-3">
        {/* Average */}
        <div className="text-center">
          <p className="text-5xl font-bold text-navy">{averageRating.toFixed(1)}</p>
          <div className="mt-2 flex justify-center">
            <StarRating rating={averageRating} />
          </div>
          <p className="mt-2 text-sm text-charcoal/60">Based on {totalReviews} reviews</p>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            {distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-12 text-sm text-charcoal/60">{item.stars} star</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-charcoal/10">
                  <div
                    className="h-full bg-gold transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-charcoal/60">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review form */}
      {showForm && (
        <div className="rounded-lg border border-gold/20 bg-white p-6">
          <ReviewForm productSlug="" productName="" />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 text-sm text-charcoal/60 hover:text-kente-red"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
        <p className="text-sm text-charcoal/60">Showing {reviews.length} reviews</p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-charcoal/60">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-md border border-charcoal/20 px-3 py-1.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {sortedReviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-charcoal/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="rounded bg-kente-green/10 px-2 py-0.5 text-[10px] font-semibold text-kente-green">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-bold text-navy">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{review.body}</p>
                {review.recommend && (
                  <p className="mt-3 text-xs text-kente-green">✓ Recommends this product</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-charcoal/5 pt-4">
              <div className="flex items-center gap-2 text-xs text-charcoal/40">
                <span className="font-medium text-navy">{review.author}</span>
                <span>·</span>
                <span>{review.date}</span>
              </div>
              <button className="text-xs text-charcoal/40 hover:text-gold">
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
