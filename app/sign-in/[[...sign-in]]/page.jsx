"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/app/components/auth/AuthShell";
import Image from "next/image";

function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || fallback;
}

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (authLoaded && isSignedIn) router.replace("/");
  }, [authLoaded, isSignedIn, router]);

  const finishSignIn = async () => {
    await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.replace(url);
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      const result = await signIn.password({ emailAddress, password });
      if (result.error) throw result.error;

      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === "email_code");
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setNeedsCode(true);
          return;
        }
      }

      if (signIn.status === "needs_second_factor") {
        setError("This account needs another verification step. Please use an email code or enabled second factor.");
        return;
      }

      setError("Sign in could not be completed. Please check your details and try again.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to sign in with those details."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!signIn || isGoogleLoading) return;

    try {
      setIsGoogleLoading(true);
      setError("");
      const result = await signIn.sso({
        strategy: "oauth_google",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/",
      });
      if (result.error) throw result.error;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to start Google sign in."));
      setIsGoogleLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      await signIn.mfa.verifyEmailCode({ code });
      if (signIn.status === "complete") await finishSignIn();
      else setError("Verification was accepted, but sign in is not complete yet.");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to verify that code."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue managing your Telygence workspace.">
      <div className="w-full rounded-2xl border border-[#E7E4F0] bg-white p-5 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!signIn || isGoogleLoading || isSubmitting}
          className="mb-4 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#D8D4E6] bg-white text-sm font-semibold text-[#1E1636] transition-colors hover:bg-[#F5F4FA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="grid h-6 w-6 place-items-center text-sm font-bold text-[#4285F4]">
            <Image src="/images/google.png" alt="Google" width={16} height={16} />
          </span>
          {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
        </button>

        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-[#E7E4F0]" />
          <span className="text-xs font-medium uppercase tracking-wide text-[#8093A8]">or</span>
          <span className="h-px flex-1 bg-[#E7E4F0]" />
        </div>

        <form className="space-y-4" onSubmit={needsCode ? handleVerify : handleSubmit}>
          {needsCode ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E1636]" htmlFor="code">
                Email verification code
              </label>
              <input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#D8D4E6] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                placeholder="Enter the code sent to your email"
                autoComplete="one-time-code"
              />
            </div>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-lg border border-[#FFD7D7] bg-[#FFF4F4] px-3 py-2 text-sm text-[#B00020]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!signIn || isSubmitting || fetchStatus === "fetching"}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#775ADA] text-sm font-bold text-white transition-colors hover:bg-[#5F48C2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : needsCode ? "Verify and sign in" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-sm text-[#737373]">
          <span>Don&apos;t have an account?</span>
          <Link className="font-semibold text-[#775ADA] hover:text-[#5F48C2]" href="/sign-up">
            Sign up
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
