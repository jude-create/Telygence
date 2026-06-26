"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/app/components/auth/AuthShell";

function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || fallback;
}

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (authLoaded && isSignedIn) router.replace("/");
  }, [authLoaded, isSignedIn, router]);

  const finishSignUp = async () => {
    await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.replace(url);
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!signUp || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      const result = await signUp.password({ emailAddress, password });
      if (result.error) throw result.error;
      await signUp.verifications.sendEmailCode();
      setIsVerifying(true);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to create an account with those details."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!signUp || isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);
      setError("");
      const result = await signUp.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/",
      });
      if (result.error) throw result.error;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to start Google sign up."));
      setIsGoogleLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!signUp || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      await signUp.verifications.verifyEmailCode({ code });
      if (signUp.status === "complete") await finishSignUp();
      else setError("Verification was accepted, but sign up is not complete yet.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to verify that code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!signUp || isSubmitting || fetchStatus === "fetching") return;
    try {
      setError("");
      await signUp.verifications.sendEmailCode();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to resend the verification code."));
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start saving drafts, templates, and tasks in your own workspace.">
      <div className="w-full rounded-2xl border border-[#E7E4F0] bg-white p-5 shadow-sm sm:p-6">
        {!isVerifying && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={!signUp || isGoogleLoading || isSubmitting}
              className="mb-4 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#D8D4E6] bg-white text-sm font-semibold text-[#1E1636] transition-colors hover:bg-[#F5F4FA] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#E7E4F0] text-sm font-bold text-[#4285F4]">
                G
              </span>
              {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
            </button>

            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#E7E4F0]" />
              <span className="text-xs font-medium uppercase tracking-wide text-[#8093A8]">or</span>
              <span className="h-px flex-1 bg-[#E7E4F0]" />
            </div>
          </>
        )}

        <form className="space-y-4" onSubmit={isVerifying ? handleVerify : handleSubmit}>
          {isVerifying ? (
            <>
              <div className="rounded-lg bg-[#F5F4FA] px-3 py-3 text-sm text-[#4D4D4D]">
                We sent a verification code to <span className="font-semibold text-[#1E1636]">{emailAddress}</span>.
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1E1636]" htmlFor="code">
                  Verification code
                </label>
                <input
                  id="code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#D8D4E6] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                  placeholder="Enter the code"
                  autoComplete="one-time-code"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1E1636]" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#D8D4E6] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1E1636]" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#D8D4E6] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div id="clerk-captcha" />
            </>
          )}

          {error && (
            <div className="rounded-lg border border-[#FFD7D7] bg-[#FFF4F4] px-3 py-2 text-sm text-[#B00020]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!signUp || isSubmitting || fetchStatus === "fetching"}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#775ADA] text-sm font-bold text-white transition-colors hover:bg-[#5F48C2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isVerifying ? "Verify and create account" : "Create account"}
          </button>
        </form>

        {isVerifying && (
          <button
            type="button"
            onClick={resendCode}
            className="mt-3 w-full text-center text-sm font-medium text-[#775ADA] hover:text-[#5F48C2]"
          >
            Send a new code
          </button>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-sm text-[#737373]">
          <span>Already have an account?</span>
          <Link className="font-semibold text-[#775ADA] hover:text-[#5F48C2]" href="/sign-in">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
