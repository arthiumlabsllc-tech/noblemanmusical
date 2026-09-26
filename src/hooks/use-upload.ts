/**
 * useUpload Hook
 * 
 * Client-side hook for uploading images to Cloudinary via the API route.
 * 
 * Usage:
 * const { upload, uploading, progress, error } = useUpload();
 * 
 * const handleUpload = async (files: File[]) => {
 *   const results = await upload(files, { folder: "nmc/products" });
 *   console.log(results);
 * };
 */

"use client";

import { useState, useCallback } from "react";

interface UploadOptions {
  folder?: string;
  tags?: string[];
}

interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface UseUploadReturn {
  upload: (files: File[], options?: UploadOptions) => Promise<UploadResult[]>;
  uploading: boolean;
  error: string | null;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: File[], options: UploadOptions = {}): Promise<UploadResult[]> => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        
        // Add files
        files.forEach((file) => {
          formData.append("files", file);
        });

        // Add options
        if (options.folder) {
          formData.append("folder", options.folder);
        }
        if (options.tags && options.tags.length > 0) {
          formData.append("tags", options.tags.join(","));
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        return data.images;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { upload, uploading, error, reset };
}
