"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    async function completeSso() {
      if (!clerk.loaded || !signIn || !signUp || hasRun.current) return;
      hasRun.current = true;

      const navigateHome = async ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        if (url.startsWith("http")) window.location.href = url;
        else router.replace(url);
      };

      const finalizeSignIn = () => signIn.finalize({ navigate: navigateHome });
      const finalizeSignUp = () => signUp.finalize({ navigate: navigateHome });
      const navigateToSignIn = () => router.replace("/sign-in");

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if (signIn.status === "complete") {
          await finalizeSignIn();
          return;
        }
        navigateToSignIn();
        return;
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every((factor) => factor.strategy === "enterprise_sso")
      ) {
        navigateToSignIn();
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        navigateToSignIn();
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (signIn.status === "needs_second_factor" || signIn.status === "needs_new_password") {
        navigateToSignIn();
        return;
      }

      if (signIn.existingSession || signUp.existingSession) {
        const sessionId = signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId, navigate: navigateHome });
          return;
        }
      }

      navigateToSignIn();
    }

    completeSso();
  }, [clerk, router, signIn, signUp]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F4FA] px-4 text-center">
      <div className="rounded-2xl border border-[#E7E4F0] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#1E1636]">Completing Google sign in...</p>
        <p className="mt-2 text-sm text-[#737373]">You will be redirected in a moment.</p>
        <div id="clerk-captcha" />
      </div>
    </main>
  );
}
