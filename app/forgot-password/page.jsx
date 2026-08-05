"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/app/components/auth/AuthShell";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || fallback;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Step 1: send the reset code
  const sendCode = async (event) => {
    event.preventDefault();
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      const { error: createError } = await signIn.create({ identifier: emailAddress });
      if (createError) throw createError;

      const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();
      if (sendCodeError) throw sendCodeError;

      setCodeSent(true);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to send a reset code to that email."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: verify the code
  const verifyCode = async (event) => {
    event.preventDefault();
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({ code });
      if (verifyError) throw verifyError;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "That code isn't valid. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: submit new password
  const submitNewPassword = async (event) => {
    event.preventDefault();
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;

    try {
      setIsSubmitting(true);
      setError("");
      const { error: resetError } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });
      if (resetError) throw resetError;

      if (signIn.status === "complete") {
        await finishSignIn();
      } else if (signIn.status === "needs_second_factor") {
        setError("This account needs another verification step to finish resetting your password.");
      } else {
        setError("Password reset was not completed. Please try again.");
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to set your new password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!signIn || isSubmitting || fetchStatus === "fetching") return;
    try {
      setError("");
      await signIn.resetPasswordEmailCode.sendCode();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Unable to resend the code."));
    }
  };

  const needsNewPassword = signIn?.status === "needs_new_password";

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a code to verify it's you.">
      <div className="w-full rounded-2xl border border-[#E7E4F0] bg-white p-5 shadow-sm sm:p-6">
        {!codeSent && (
          <form className="space-y-4" onSubmit={sendCode}>
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
              {isSubmitting ? "Please wait..." : "Send reset code"}
            </button>
          </form>
        )}

        {codeSent && !needsNewPassword && (
          <form className="space-y-4" onSubmit={verifyCode}>
            <div className="rounded-lg bg-[#F5F4FA] px-3 py-3 text-sm text-[#4D4D4D]">
              We sent a code to <span className="font-semibold text-[#1E1636]">{emailAddress}</span>.
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
              {isSubmitting ? "Please wait..." : "Verify code"}
            </button>

            <button
              type="button"
              onClick={resendCode}
              className="w-full text-center text-sm font-medium text-[#775ADA] hover:text-[#5F48C2]"
            >
              Send a new code
            </button>
          </form>
        )}

        {needsNewPassword && (
          <form className="space-y-4" onSubmit={submitNewPassword}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E1636]" htmlFor="newPassword">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#D8D4E6] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#775ADA]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-[#775ADA] hover:text-[#5F48C2]"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

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
              {isSubmitting ? "Please wait..." : "Set new password"}
            </button>
          </form>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1 text-sm text-[#737373]">
          <span>Remembered your password?</span>
          <Link className="font-semibold text-[#775ADA] hover:text-[#5F48C2]" href="/sign-in">
            Sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}