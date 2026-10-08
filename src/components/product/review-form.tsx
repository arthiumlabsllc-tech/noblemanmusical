"use client";

import { useState } from "react";

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";
const labelCls = "block text-sm font-medium text-body";

type ReviewFormProps = {
  productSlug: string;
  productName: string;
};

export default function ReviewForm({ productSlug, productName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [recommend, setRecommend] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to an API
    console.log("Review submitted:", { productSlug, rating, title, body, nickname, email, recommend });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-kente-green/20 bg-kente-green/5 p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-kente-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="mt-4 text-lg font-bold text-navy">Thank you for your review!</h3>
        <p className="mt-2 text-sm text-body">
          Your review has been submitted and will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-navy">Write a Review</h3>
        <p className="text-sm text-body">
          Share your thoughts about the {productName} with other customers.
        </p>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-body">Overall Rating *</label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`h-8 w-8 ${(hoverRating || rating) >= star ? "text-gold" : "text-line"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-navy">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-body">Review Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          required
          className={inputCls}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-body">Review Content *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you like or dislike? How did this product perform?"
          rows={4}
          required
          className={inputCls}
        />
      </div>

      {/* Recommend */}
      <div>
        <label className="block text-sm font-medium text-body">Would you recommend this product? *</label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="recommend"
              value="yes"
              checked={recommend === "yes"}
              onChange={(e) => setRecommend(e.target.value as "yes" | "no")}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-sm text-navy">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="recommend"
              value="no"
              checked={recommend === "no"}
              onChange={(e) => setRecommend(e.target.value as "yes" | "no")}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-sm text-navy">No</span>
          </label>
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-body">Your Name *</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="How you'll appear"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-body">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Not published"
            required
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className="w-full border border-navy bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Review
      </button>
    </form>
  );
}
