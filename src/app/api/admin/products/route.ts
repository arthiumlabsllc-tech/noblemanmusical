/**
 * POST /api/admin/products
 * Create a new product
 */

import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/admin/actions";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await createProduct(formData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Create product error:", error);
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export const runtime = "nodejs";
