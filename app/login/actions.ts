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
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
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
