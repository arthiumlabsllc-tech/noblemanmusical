/**
 * Cloudinary Integration
 * 
 * Central export for all Cloudinary utilities.
 * 
 * Usage:
 * - Server-side: import { uploadImage, deleteImage } from "@/lib/cloudinary"
 * - Client-side: Use the API routes in /api/upload
 * 
 * IMPORTANT: Never import this in client components directly.
 * Use the API routes or server actions instead.
 */

// Configuration
export { default as cloudinary } from "./config";

// Upload utilities
export {
  uploadImage,
  uploadMultipleImages,
  uploadFromDataUrl,
  uploadFromFile,
  generateSignedUploadUrl,
  getOptimizedUrl,
  getResponsiveUrls,
  CLOUDINARY_FOLDERS,
  type UploadResult,
  type UploadOptions,
} from "./upload";

// Management utilities
export {
  deleteImage,
  deleteMultipleImages,
  deleteFolder,
  listImages,
  searchByTag,
  getImageDetails,
  renameImage,
  moveImage,
  getFolderStats,
  getStorageUsage,
  type ImageDetails,
  type ListImagesResult,
} from "./manage";
