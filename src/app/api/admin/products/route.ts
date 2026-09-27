/**
 * POST /api/admin/products
 * Create a new product
 */

import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/admin/actions";
import { getAdminSession, isUnauthorizedError } from "@/lib/auth/guard";

export async function POST(request: NextRequest) {
  try {
    // Explicit check so unauthorized callers get a clean 401. `createProduct`
    // also asserts the role itself, so this is defence in depth rather than
    // the only line of protection.
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const result = await createProduct(formData);
    return NextResponse.json(result);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create product error:", error);
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export const runtime = "nodejs";
