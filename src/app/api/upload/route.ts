/**
 * POST /api/upload
 * 
 * Upload images to Cloudinary.
 * 
 * Request:
 * - FormData with "files" field (one or more files)
 * - Optional "folder" field (defaults to nmc/products)
 * - Optional "tags" field (comma-separated)
 * 
 * Response:
 * - { images: UploadResult[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadFromFile, CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth/guard";

export async function POST(request: NextRequest) {
  try {
    // middleware.ts passes every /api/* path through without a session check,
    // so this handler must authorize itself — otherwise any visitor can write
    // to the Cloudinary account and consume its storage/bandwidth quota.
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || CLOUDINARY_FOLDERS.PRODUCTS;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : [];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Only images are allowed.` },
          { status: 400 }
        );
      }

      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size is 10MB.` },
          { status: 400 }
        );
      }
    }

    // Upload all files
    const results = await Promise.all(
      files.map((file) =>
        uploadFromFile(file, {
          folder,
          tags,
        })
      )
    );

    return NextResponse.json({ images: results });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}

// Configure route
export const runtime = "nodejs";
export const maxDuration = 30; // 30 seconds timeout
