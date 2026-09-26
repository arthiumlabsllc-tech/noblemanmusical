/**
 * Cloudinary Upload Utility
 * 
 * Server-side only — use in API routes, server actions, or server components.
 * 
 * Features:
 * - Upload single or multiple images
 * - Automatic folder organization by category
 * - Image optimization (auto quality, format)
 * - Generate signed upload URLs for client-side uploads
 */

import cloudinary from "./config";

// ── Types ──

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: Array<Record<string, unknown>>;
  publicId?: string;
}

// ── Folder Structure ──

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: "nmc/products",
  HERO: "nmc/hero",
  BRANDS: "nmc/brands",
  CATEGORIES: "nmc/categories",
  BANNERS: "nmc/banners",
  AVATARS: "nmc/avatars",
} as const;

// ── Upload Functions ──

/**
 * Upload a single image from a file path or URL
 */
export async function uploadImage(
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { folder = CLOUDINARY_FOLDERS.PRODUCTS, tags = [], transformation, publicId } = options;

  const result = await cloudinary.uploader.upload(
    file as string,
    {
      folder,
      tags: ["nmc", ...tags],
      resource_type: "image",
      public_id: publicId,
      transformation: transformation ?? [
        { quality: "auto", fetch_format: "auto" },
      ],
      overwrite: true,
      invalidate: true,
    }
  );

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: Array<string | Buffer>,
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, options))
  );
  return results;
}

/**
 * Upload from a data URL (base64)
 */
export async function uploadFromDataUrl(
  dataUrl: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  return uploadImage(dataUrl, options);
}

/**
 * Upload from a File object (in server actions)
 */
export async function uploadFromFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  return uploadImage(buffer as unknown as string, {
    ...options,
    transformation: options.transformation ?? [
      { quality: "auto", fetch_format: "auto" },
    ],
  });
}

// ── Signed Upload URL (for client-side uploads) ──

/**
 * Generate a signed upload URL for secure client-side uploads
 * Use this when you want to upload directly from the browser
 */
export function generateSignedUploadUrl(
  folder: string = CLOUDINARY_FOLDERS.PRODUCTS,
  tags: string[] = []
): { signature: string; timestamp: number; apiKey: string; cloudName: string } {
  const timestamp = Math.round(Date.now() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      tags: ["nmc", ...tags].join(","),
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

// ── Image Transformation Helpers ──

/**
 * Generate an optimized image URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: number | "auto";
    format?: "auto" | "webp" | "avif" | "jpg" | "png";
  } = {}
): string {
  const { width, height, crop = "fill", quality = "auto", format = "auto" } = options;

  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(",");
  
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate responsive image URLs for different screen sizes
 */
export function getResponsiveUrls(publicId: string): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
} {
  return {
    thumbnail: getOptimizedUrl(publicId, { width: 150, height: 150, crop: "fill" }),
    small: getOptimizedUrl(publicId, { width: 400, height: 400, crop: "fill" }),
    medium: getOptimizedUrl(publicId, { width: 800, height: 800, crop: "fill" }),
    large: getOptimizedUrl(publicId, { width: 1200, height: 1200, crop: "fill" }),
    original: getOptimizedUrl(publicId),
  };
}
