"use client";

import AuthContainer from "@/components/auth/AuthContainer";
import PopUp from "@/components/layout/PopUp";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode = modeParam === "register" ? "register" : "login";

  return (
    <div>
      <PopUp
        title=""
        onClose={() => { router.push("/") }}
        content={<AuthContainer initialMode={initialMode} />}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthPageContent />
    </Suspense>
  )
}
