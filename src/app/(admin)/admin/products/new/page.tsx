"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Package, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesChange = useCallback((urls: string[]) => {
    setImages(urls);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add images as JSON
      formData.set("images", JSON.stringify(images));
      
      // Add default values for fields that might be empty
      if (!formData.get("specs")) formData.set("specs", JSON.stringify({}));
      if (!formData.get("tags")) formData.set("tags", JSON.stringify([]));

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-navy-deep"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
            <Package className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-deep">Add New Product</h1>
            <p className="text-sm text-charcoal/60">Fill in the details below to create a product</p>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-lg border border-kente-red/20 bg-kente-red/5 px-4 py-3">
          <p className="text-sm text-kente-red">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content — left 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Product Name <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Fender Stratocaster Electric Guitar"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Slug <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="slug"
                    required
                    placeholder="e.g. fender-stratocaster"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm font-mono focus:border-gold focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-charcoal/40">URL-friendly name, lowercase with hyphens</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Short Description <span className="text-kente-red">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={2}
                    placeholder="Brief description shown in product cards"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Long Description
                  </label>
                  <textarea
                    name="longDescription"
                    rows={5}
                    placeholder="Detailed description shown on the product page"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gold" />
                <h3 className="font-medium text-navy-deep">Product Images</h3>
              </div>
              <ImageUpload
                onImagesChange={handleImagesChange}
                maxImages={8}
                folder="nmc/products"
              />
            </div>

            {/* SEO */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">SEO Title</label>
                  <input
                    name="seoTitle"
                    placeholder="Override page title for search engines"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">Meta Description</label>
                  <textarea
                    name="seoDescription"
                    rows={2}
                    placeholder="Brief description for search engine results"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">Pricing</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Price (pesewas) <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 150000 (= GHS 1,500.00)"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm tabular-nums focus:border-gold focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-charcoal/40">Price in Ghana pesewas (100 pesewas = 1 GHS)</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Compare-at Price (pesewas)
                  </label>
                  <input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    placeholder="Original price for sale items"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm tabular-nums focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">Inventory</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Stock Quantity <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue={0}
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm tabular-nums focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Low Stock Threshold
                  </label>
                  <input
                    name="lowStockThreshold"
                    type="number"
                    min="0"
                    defaultValue={5}
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm tabular-nums focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">Classification</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Category <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="categoryId"
                    required
                    placeholder="Category ID"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal/60">
                    Brand <span className="text-kente-red">*</span>
                  </label>
                  <input
                    name="brandId"
                    required
                    placeholder="Brand ID"
                    className="w-full rounded-lg border border-cream-dark px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-cream-dark bg-white p-5">
              <h3 className="mb-4 font-medium text-navy-deep">Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked
                    value="true"
                    className="h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-charcoal/70">Active (visible on store)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    name="isFeatured"
                    type="checkbox"
                    value="true"
                    className="h-4 w-4 rounded border-cream-dark text-gold focus:ring-gold"
                  />
                  <span className="text-sm text-charcoal/70">Featured product</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-deep px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-navy disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Product
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="rounded-lg border border-cream-dark px-4 py-2.5 text-sm font-medium text-charcoal/60 hover:bg-cream/50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
