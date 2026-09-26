"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";

// ── Types ──

interface UploadedImage {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
}

interface ImageUploadProps {
  /** Currently stored image URLs (for editing existing products) */
  existingImages?: string[];
  /** Called whenever the image list changes */
  onImagesChange?: (urls: string[]) => void;
  /** Max number of images allowed */
  maxImages?: number;
  /** Cloudinary folder to upload to */
  folder?: string;
  /** Tags to attach to uploaded images */
  tags?: string[];
  className?: string;
}

interface PendingFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  result?: UploadedImage;
}

// ── Component ──

export function ImageUpload({
  existingImages = [],
  onImagesChange,
  maxImages = 8,
  folder = "nmc/products",
  tags = [],
  className,
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload();

  const remainingSlots = maxImages - images.length - pendingFiles.filter((f) => f.status !== "error").length;

  // Notify parent of image changes
  const updateImages = useCallback(
    (newImages: string[]) => {
      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [onImagesChange]
  );

  // Generate unique ID for tracking
  const makeId = () => Math.random().toString(36).slice(2, 10);

  // Create local previews for pending files
  const createPreviews = useCallback(
    (files: File[]): PendingFile[] =>
      files.map((file) => ({
        id: makeId(),
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
        progress: 0,
      })),
    []
  );

  // Handle file selection
  const handleFiles = useCallback(
    async (files: File[]) => {
      // Filter to valid image types
      const validFiles = files.filter((f) => f.type.startsWith("image/"));
      if (validFiles.length === 0) return;

      // Limit to remaining slots
      const toUpload = validFiles.slice(0, remainingSlots);
      const previews = createPreviews(toUpload);

      setPendingFiles((prev) => [...prev, ...previews]);

      // Upload each file individually for per-file progress tracking
      for (const pf of previews) {
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === pf.id ? { ...p, status: "uploading", progress: 30 } : p
          )
        );

        try {
          const results = await upload([pf.file], { folder, tags });

          if (results.length > 0) {
            setPendingFiles((prev) =>
              prev.map((p) =>
                p.id === pf.id
                  ? { ...p, status: "done", progress: 100, result: results[0] }
                  : p
              )
            );

            // Add to final image list
            updateImages([...images, results[0].secureUrl]);

            // Revoke local preview
            URL.revokeObjectURL(pf.preview);
          }
        } catch (err) {
          setPendingFiles((prev) =>
            prev.map((p) =>
              p.id === pf.id
                ? {
                    ...p,
                    status: "error",
                    error: err instanceof Error ? err.message : "Upload failed",
                  }
                : p
            )
          );
        }
      }
    },
    [remainingSlots, images, upload, folder, tags, updateImages, createPreviews]
  );

  // Remove an image
  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      updateImages(newImages);
    },
    [images, updateImages]
  );

  // Remove a pending/error file
  const removePending = useCallback((id: string) => {
    setPendingFiles((prev) => {
      const file = prev.find((p) => p.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  // Retry a failed upload
  const retryUpload = useCallback(
    async (id: string) => {
      const pf = pendingFiles.find((p) => p.id === id);
      if (!pf) return;

      setPendingFiles((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "uploading", progress: 30, error: undefined } : p
        )
      );

      try {
        const results = await upload([pf.file], { folder, tags });
        if (results.length > 0) {
          setPendingFiles((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, status: "done", progress: 100, result: results[0] } : p
            )
          );
          updateImages([...images, results[0].secureUrl]);
          URL.revokeObjectURL(pf.preview);
        }
      } catch (err) {
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
              : p
          )
        );
      }
    },
    [pendingFiles, images, upload, folder, tags, updateImages]
  );

  // ── Drag handlers ──

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFiles(files);
    },
    [handleFiles]
  );

  // ── File input change ──

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) handleFiles(files);
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [handleFiles]
  );

  // ── Cleanup on unmount ──
  // (handled by browser when Object URLs are garbage collected)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
          isDragActive
            ? "border-gold bg-gold/5"
            : "border-cream-dark bg-cream/30 hover:border-gold/50 hover:bg-cream/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />

        <div
          className={cn(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
            isDragActive ? "bg-gold/20" : "bg-cream-dark"
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6 transition-colors",
              isDragActive ? "text-gold" : "text-charcoal/40"
            )}
          />
        </div>

        <p className="text-sm font-medium text-navy-deep">
          {isDragActive ? "Drop images here" : "Drag & drop images here"}
        </p>
        <p className="mt-1 text-xs text-charcoal/50">
          or click to browse · PNG, JPG, WebP up to 10MB
        </p>
        <p className="mt-2 text-xs text-charcoal/40">
          {images.length} of {maxImages} images · {remainingSlots} slots remaining
        </p>
      </div>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-charcoal/60">Uploaded Images</p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
            {images.map((url, i) => (
              <motion.div
                key={`${url}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-cream-dark"
              >
                <Image
                  src={url}
                  alt={`Product image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="rounded-full bg-kente-red p-1.5 text-cream transition-transform hover:scale-110"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Primary badge */}
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold text-navy-deep">
                    Primary
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pending / uploading / error files */}
      <AnimatePresence>
        {pendingFiles.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-charcoal/60">
              {pendingFiles.some((f) => f.status === "uploading")
                ? "Uploading..."
                : "Recent uploads"}
            </p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
              {pendingFiles.map((pf) => (
                <motion.div
                  key={pf.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-cream-dark"
                >
                  {/* Preview */}
                  <Image
                    src={pf.preview}
                    alt={pf.file.name}
                    fill
                    className={cn(
                      "object-cover transition-opacity",
                      pf.status === "error" && "opacity-40"
                    )}
                    sizes="100px"
                  />

                  {/* Progress overlay */}
                  {pf.status === "uploading" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/60">
                      <Loader2 className="h-5 w-5 animate-spin text-gold" />
                      <div className="mt-2 h-1 w-3/4 overflow-hidden rounded-full bg-cream/20">
                        <motion.div
                          className="h-full rounded-full bg-gold"
                          initial={{ width: "0%" }}
                          animate={{ width: `${pf.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Done overlay */}
                  {pf.status === "done" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-kente-green/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <Check className="h-5 w-5 text-kente-green" />
                    </div>
                  )}

                  {/* Error overlay */}
                  {pf.status === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-kente-red/10">
                      <AlertCircle className="h-4 w-4 text-kente-red" />
                      <button
                        type="button"
                        onClick={() => retryUpload(pf.id)}
                        className="mt-1 rounded bg-navy-deep/80 px-2 py-0.5 text-[10px] text-cream hover:bg-navy-deep"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Remove button */}
                  {pf.status !== "uploading" && (
                    <button
                      type="button"
                      onClick={() => removePending(pf.id)}
                      className="absolute right-1 top-1 rounded-full bg-navy-deep/70 p-1 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
