import { StarRating } from "@/components/ui/star-rating";

// Placeholder data
const reviews = [
  { id: "1", author: "Kwame A.", rating: 5, title: "Amazing guitar!", body: "The Fender Player Stratocaster exceeded my expectations. The tone is incredible and it plays like butter. Highly recommend for intermediate to advanced players.", date: "2024-09-25", verified: true, helpful: 12, recommend: true, product: "Fender Player Stratocaster", status: "approved" },
  { id: "2", author: "Ama S.", rating: 4, title: "Great value", body: "Solid instrument for the price. The finish is beautiful and it stays in tune well. Only minor issue is the action was a bit high out of the box.", date: "2024-09-20", verified: true, helpful: 8, recommend: true, product: "Yamaha C40 Classical Guitar", status: "approved" },
  { id: "3", author: "John D.", rating: 5, title: "Perfect for church", body: "We bought 4 of these for our worship team. The sound is clear and they handle feedback well. Great for live settings.", date: "2024-09-18", verified: true, helpful: 15, recommend: true, product: "Shure SM58 Microphone", status: "approved" },
  { id: "4", author: "Grace M.", rating: 3, title: "Decent but...", body: "The piano sounds good and the key action is realistic. However, the built-in speakers are a bit weak. Recommend using external speakers for better sound.", date: "2024-09-15", verified: false, helpful: 5, recommend: true, product: "Yamaha P-125 Digital Piano", status: "pending" },
  { id: "5", author: "Kofi M.", rating: 2, title: "Not what I expected", body: "The product quality is okay but the delivery took too long and the packaging was damaged. Customer service was helpful though.", date: "2024-09-10", verified: true, helpful: 3, recommend: false, product: "Boss DS-1 Distortion", status: "approved" },
  { id: "6", author: "Esi K.", rating: 5, title: "Love it!", body: "This is my first digital piano and I'm in love. The touch sensitivity is amazing and it comes with great built-in sounds.", date: "2024-09-05", verified: true, helpful: 20, recommend: true, product: "Roland FP-30X", status: "approved" },
];

const statusColors: Record<string, string> = {
  approved: "bg-kente-green/10 text-kente-green",
  pending: "bg-charcoal/10 text-charcoal",
  rejected: "bg-kente-red/10 text-kente-red",
};

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Customer Reviews</h1>
          <p className="text-sm text-charcoal/60">{reviews.length} total reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Reviews", value: reviews.length, color: "text-navy" },
          { label: "Approved", value: reviews.filter((r) => r.status === "approved").length, color: "text-kente-green" },
          { label: "Pending", value: reviews.filter((r) => r.status === "pending").length, color: "text-charcoal" },
          { label: "Avg Rating", value: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1), color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-charcoal/10 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/60">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Approved", "Pending", "Rejected"].map((filter) => (
          <button
            key={filter}
            className="rounded-md border border-charcoal/10 px-3 py-1.5 text-xs font-medium text-charcoal/60 hover:border-gold hover:text-gold"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reviews table */}
      <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream/50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Product</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Author</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Rating</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Review</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Status</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-cream/30">
                <td className="px-6 py-4">
                  <p className="font-medium text-navy line-clamp-1">{review.product}</p>
                  <p className="text-xs text-charcoal/40">{review.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-navy">{review.author}</p>
                  {review.verified && (
                    <p className="text-[10px] text-kente-green">✓ Verified</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StarRating rating={review.rating} size="sm" />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-navy line-clamp-1">{review.title}</p>
                  <p className="text-xs text-charcoal/40 line-clamp-1">{review.body}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[review.status]}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {review.status === "pending" && (
                      <>
                        <button className="text-xs font-medium text-kente-green hover:underline">
                          Approve
                        </button>
                        <button className="text-xs font-medium text-kente-red hover:underline">
                          Reject
                        </button>
                      </>
                    )}
                    {review.status === "approved" && (
                      <button className="text-xs font-medium text-charcoal/40 hover:text-kente-red">
                        Remove
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
