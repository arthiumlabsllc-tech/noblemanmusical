/**
 * Cloudinary Management Utility
 * 
 * Server-side only — use in API routes, server actions, or scripts.
 * 
 * Features:
 * - Delete single or multiple images
 * - Delete entire folders
 * - List images by folder or tag
 * - Rename/move images
 * - Get image details
 */

import cloudinary from "./config";

// ── Types ──

export interface ImageDetails {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  tags: string[];
}

export interface ListImagesResult {
  resources: ImageDetails[];
  nextCursor?: string;
}

// ── Delete Functions ──

/**
 * Delete a single image by public ID
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  const result = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
  });
  return result;
}

/**
 * Delete multiple images by public IDs
 */
export async function deleteMultipleImages(
  publicIds: string[]
): Promise<{ deleted: Record<string, { result: string }> }> {
  const result = await cloudinary.api.delete_resources(publicIds, {
    invalidate: true,
  });
  return result;
}

/**
 * Delete all images in a folder
 */
export async function deleteFolder(folderPath: string): Promise<{ deleted: string[] }> {
  // First, get all resources in the folder
  const resources = await cloudinary.api.resources({
    type: "upload",
    prefix: folderPath,
    max_results: 500,
  });

  const publicIds = resources.resources.map((r: { public_id: string }) => r.public_id);

  if (publicIds.length === 0) {
    return { deleted: [] };
  }

  // Delete all resources
  await cloudinary.api.delete_resources(publicIds, {
    invalidate: true,
  });

  // Delete the folder itself (if empty)
  try {
    await cloudinary.api.delete_folder(folderPath);
  } catch {
    // Folder might not be empty or already deleted
  }

  return { deleted: publicIds };
}

// ── List/Search Functions ──

/**
 * List images in a folder
 */
export async function listImages(
  folder: string,
  options: {
    maxResults?: number;
    nextCursor?: string;
  } = {}
): Promise<ListImagesResult> {
  const { maxResults = 50, nextCursor } = options;

  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: maxResults,
    next_cursor: nextCursor,
    direction: "desc", // newest first
  });

  return {
    resources: result.resources.map((r: {
      public_id: string;
      secure_url: string;
      url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
      created_at: string;
      tags: string[];
    }) => ({
      publicId: r.public_id,
      url: r.url,
      secureUrl: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
      tags: r.tags || [],
    })),
    nextCursor: result.next_cursor,
  };
}

/**
 * Search images by tag
 */
export async function searchByTag(
  tag: string,
  options: {
    maxResults?: number;
    nextCursor?: string;
  } = {}
): Promise<ListImagesResult> {
  const { maxResults = 50, nextCursor } = options;

  const result = await cloudinary.api.resources_by_tag(tag, {
    max_results: maxResults,
    next_cursor: nextCursor,
  });

  return {
    resources: result.resources.map((r: {
      public_id: string;
      secure_url: string;
      url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
      created_at: string;
      tags: string[];
    }) => ({
      publicId: r.public_id,
      url: r.url,
      secureUrl: r.secure_url,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
      tags: r.tags || [],
    })),
    nextCursor: result.next_cursor,
  };
}

/**
 * Get details of a single image
 */
export async function getImageDetails(publicId: string): Promise<ImageDetails> {
  const result = await cloudinary.api.resource(publicId);

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
    createdAt: result.created_at,
    tags: result.tags || [],
  };
}

// ── Rename/Move Functions ──

/**
 * Rename an image (change public ID)
 */
export async function renameImage(
  fromPublicId: string,
  toPublicId: string
): Promise<{ public_id: string }> {
  const result = await cloudinary.uploader.rename(fromPublicId, toPublicId, {
    invalidate: true,
  });
  return result;
}

/**
 * Move an image to a different folder
 */
export async function moveImage(
  fromPublicId: string,
  toFolder: string
): Promise<{ public_id: string }> {
  const fileName = fromPublicId.split("/").pop();
  const toPublicId = `${toFolder}/${fileName}`;
  return renameImage(fromPublicId, toPublicId);
}

// ── Admin Functions ──

/**
 * Get folder usage statistics
 */
export async function getFolderStats(): Promise<Record<string, number>> {
  const folders = [
    "nmc/products",
    "nmc/hero",
    "nmc/brands",
    "nmc/categories",
    "nmc/banners",
    "nmc/avatars",
  ];

  const stats: Record<string, number> = {};

  for (const folder of folders) {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: 500,
    });
    stats[folder] = result.resources.length;
  }

  return stats;
}

/**
 * Get total storage usage
 */
export async function getStorageUsage(): Promise<{
  used: number;
  limit: number;
  percentUsed: number;
}> {
  const usage = await cloudinary.api.usage();
  
  return {
    used: usage.storage.usage,
    limit: usage.storage.limit,
    percentUsed: (usage.storage.usage / usage.storage.limit) * 100,
  };
}
