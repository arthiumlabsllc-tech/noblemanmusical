/**
 * GET /api/images
 * List images from Cloudinary
 * 
 * Query params:
 * - folder: string (required)
 * - maxResults: number (optional, default 50)
 * - nextCursor: string (optional, for pagination)
 * 
 * Response:
 * - { resources: ImageDetails[], nextCursor?: string }
 */

/**
 * DELETE /api/images
 * Delete images from Cloudinary
 * 
 * Body:
 * - { publicIds: string[] }
 * 
 * Response:
 * - { deleted: Record<string, { result: string }> }
 */

import { NextRequest, NextResponse } from "next/server";
import { listImages, deleteMultipleImages } from "@/lib/cloudinary";
import { getAdminSession } from "@/lib/auth/guard";

// middleware.ts does not authenticate /api/* paths, so both handlers below
// must check for themselves. DELETE in particular is destructive: unguarded
// it lets any visitor remove product images by public ID.
export async function GET(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const maxResults = parseInt(searchParams.get("maxResults") || "50");
    const nextCursor = searchParams.get("nextCursor") || undefined;

    if (!folder) {
      return NextResponse.json(
        { error: "Folder parameter is required" },
        { status: 400 }
      );
    }

    const result = await listImages(folder, { maxResults, nextCursor });

    return NextResponse.json(result);
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { publicIds } = body as { publicIds: string[] };

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: "publicIds array is required" },
        { status: 400 }
      );
    }

    const result = await deleteMultipleImages(publicIds);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete images error:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
