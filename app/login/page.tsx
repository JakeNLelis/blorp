import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, signup, signInWithGoogle } from "./actions";
import Image from "next/image";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    status?: string;
    mode?: string;
    email?: string;
  }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "Missing email or password.",
  invalid_credentials: "Invalid credentials.",
  password_mismatch: "Passwords do not match.",
  signup_failed: "Could not create your account. Please try again.",
  auth_failed: "Could not authenticate user.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error;
  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? "An unexpected error occurred.")
    : null;
  const mode = params?.mode === "signup" ? "signup" : "login";
  const status = params?.status;
  const email = params?.email;
  const isConfirmationState = status === "confirm-email";
  return (
    <div className="min-h-svh lg:h-svh lg:overflow-hidden bg-background text-foreground">
      <div className="grid min-h-svh lg:h-svh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden lg:rounded-r-[40px]">
          <Image
            alt="People greeting in a bright studio"
            className="h-full w-full object-cover"
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Portrait-of-a-Woman-and-Man-2.png"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
          />
        </div>
        <div className="relative flex items-center justify-center px-6 py-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_39px,rgba(0,0,0,0.06)_40px),linear-gradient(90deg,transparent_39px,rgba(0,0,0,0.06)_40px)] bg-size-[40px_40px] dark:bg-[linear-gradient(transparent_39px,rgba(255,255,255,0.06)_40px),linear-gradient(90deg,transparent_39px,rgba(255,255,255,0.06)_40px)]" />
          <div className="relative w-full max-w-md space-y-8">
            <div className="space-y-2">
              {isConfirmationState ? (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Confirm your email
                  </h1>
                  <p className="text-sm text-muted-foreground font-sans">
                    We sent a confirmation link{email ? ` to ${email}` : ""}.
                    Please confirm your email first before logging in.
                  </p>
                </>
              ) : mode === "signup" ? (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Create account
                  </h1>
                  <p className="text-sm text-muted-foreground font-sans">
                    Sign up to create your account.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground font-sans">
                    Log in to your account.
                  </p>
                </>
              )}
            </div>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                {errorMessage}
              </p>
            )}
            {!isConfirmationState ? (
              <>
                <form className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="johndoe@gmail.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  {mode === "signup" ? (
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium"
                        htmlFor="confirmPassword"
                      >
                        Confirm password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                      />
                    </div>
                  ) : null}
                  <div className="flex gap-4">
                    {mode === "signup" ? (
                      <Button
                        formAction={signup}
                        className="h-12 w-full rounded-full"
                      >
                        Sign up
                      </Button>
                    ) : (
                      <Button
                        formAction={login}
                        className="h-12 w-full rounded-full"
                      >
                        Log in
                      </Button>
                    )}
                  </div>
                </form>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-4">
                  <form action={signInWithGoogle}>
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-full text-foreground"
                      type="submit"
                    >
                      <span className="flex items-center gap-3">
                        <svg
                          aria-hidden="true"
                          className="size-5"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.23 0 5.56 1.4 6.84 2.57l4.7-4.7C32.7 4.64 28.7 3 24 3 14.7 3 6.78 8.62 3.86 16.73l5.72 4.44C11.6 14.1 17.3 9.5 24 9.5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M46.5 24.5c0-1.52-.14-2.98-.39-4.39H24v8.31h12.64c-.54 2.83-2.18 5.23-4.6 6.83l5.64 4.38c3.3-3.05 5.82-7.56 5.82-15.13z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M9.58 28.17c-.52-1.57-.82-3.25-.82-5s.3-3.43.82-5l-5.72-4.44A21.96 21.96 0 0 0 2 23.17c0 3.52.84 6.86 2.36 9.94l5.22-4.94z"
                          />
                          <path
                            fill="#34A853"
                            d="M24 44c6.3 0 11.6-2.08 15.46-5.62l-5.64-4.38c-1.57 1.05-3.6 1.67-5.82 1.67-6.7 0-12.4-4.6-14.42-10.83l-5.22 4.94C10.78 38.38 16.7 44 24 44z"
                          />
                        </svg>
                        Continue with Google
                      </span>
                    </Button>
                  </form>
                  {mode === "login" ? (
                    <p className="text-center text-sm text-muted-foreground font-sans">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/login?mode=signup"
                        className="font-medium text-foreground underline underline-offset-4"
                      >
                        Create account. Sign up
                      </a>
                    </p>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground font-sans">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="font-medium text-foreground underline underline-offset-4"
                      >
                        Log in
                      </a>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border bg-muted/40 p-6 text-center space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-sm text-muted-foreground font-sans">
                  Your account was created. Please confirm your email first
                  before logging in.
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Back to login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
