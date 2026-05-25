"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");

  if (typeof emailRaw !== "string" || typeof passwordRaw !== "string") {
    return redirect("/login?error=missing_fields");
  }

  const email = emailRaw.trim();
  const password = passwordRaw;

  if (!email || !password) {
    return redirect("/login?error=missing_fields");
  }

  const supabase = await createClient();

  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/login?error=invalid_credentials");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");
  const confirmPasswordRaw = formData.get("confirmPassword");

  if (
    typeof emailRaw !== "string" ||
    typeof passwordRaw !== "string" ||
    typeof confirmPasswordRaw !== "string"
  ) {
    return redirect("/login?mode=signup&error=missing_fields");
  }

  const email = emailRaw.trim();
  const password = passwordRaw;
  const confirmPassword = confirmPasswordRaw;

  if (!email || !password || !confirmPassword) {
    return redirect("/login?mode=signup&error=missing_fields");
  }

  if (password !== confirmPassword) {
    return redirect("/login?mode=signup&error=password_mismatch");
  }

  const supabase = await createClient();

  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect("/login?mode=signup&error=signup_failed");
  }

  revalidatePath("/", "layout");
  redirect(`/login?status=confirm-email&email=${encodeURIComponent(email)}`);
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const hdrs = await headers();
  const originHeader = hdrs.get("origin");
  const hostHeader = hdrs.get("host");

  // Determine the site origin reliably across local dev and production.
  // 1. Explicit env var (set by the developer in Vercel dashboard / .env)
  // 2. VERCEL_URL (auto-injected by Vercel — does NOT include protocol)
  // 3. origin / host request headers (works in local dev)
  // 4. Fallback to localhost for pure local dev
  let siteOrigin: string;
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    siteOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.VERCEL_URL) {
    siteOrigin = `https://${process.env.VERCEL_URL}`;
  } else if (originHeader) {
    siteOrigin = originHeader;
  } else if (hostHeader) {
    const protocol =
      hostHeader.includes("localhost") || hostHeader.includes("127.0.0.1")
        ? "http"
        : "https";
    siteOrigin = `${protocol}://${hostHeader}`;
  } else {
    siteOrigin = "http://localhost:3000";
  }

  // Strip any trailing slash to avoid double-slash in the callback URL
  const redirectTo = `${siteOrigin.replace(/\/+$/, "")}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) {
    return redirect("/login?error=auth_failed");
  }

  if (data.url) {
    redirect(data.url);
  } else {
    redirect("/");
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
