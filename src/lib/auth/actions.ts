"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   Validation Schemas
   ═══════════════════════════════════════════════════════════ */

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  redirectTo: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/* ═══════════════════════════════════════════════════════════
   Result type
   ═══════════════════════════════════════════════════════════ */

type ActionResult = {
  success: boolean;
  error?: string;
};

/* ═══════════════════════════════════════════════════════════
   Register
   ═══════════════════════════════════════════════════════════ */

export async function registerAction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, phone, password } = parsed.data;

  // Check if user already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  await db.insert(users).values({
    name,
    email,
    phone: phone || null,
    passwordHash,
    role: "customer",
  });

  // Auto-login after registration
  try {
    await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch {
    // If auto-login fails, user can still login manually
  }

  revalidatePath("/");
  redirect("/account");
}

/* ═══════════════════════════════════════════════════════════
   Login
   ═══════════════════════════════════════════════════════════ */

export async function loginAction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;

  try {
    await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        default:
          return { success: false, error: "An error occurred during sign in." };
      }
    }
    throw error;
  }

  revalidatePath("/");
  redirect("/account");
}

/* ═══════════════════════════════════════════════════════════
   Login with Google
   ═══════════════════════════════════════════════════════════ */

export async function loginWithGoogle() {
  await nextAuthSignIn("google", { redirectTo: "/account" });
}

/* ═══════════════════════════════════════════════════════════
   Logout
   ═══════════════════════════════════════════════════════════ */

export async function logoutAction() {
  await nextAuthSignOut({ redirectTo: "/" });
}

/* ═══════════════════════════════════════════════════════════
   Forgot Password
   ═══════════════════════════════════════════════════════════ */

export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { email } = parsed.data;

  // Check if user exists
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // TODO: Generate reset token, send email via Resend
  // For now, return success (email sending will be wired in Phase 4)

  return { success: true };
}
