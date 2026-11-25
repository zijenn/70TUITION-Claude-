"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUI } from "@/components/providers/ui-provider";

function AutoLoginTriggerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openModal } = useUI();

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      const next = searchParams.get("next");
      // Only same-site paths, never "//evil.com" or full URLs.
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
      openModal({ type: "login", next: safeNext });
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}

export function AutoLoginTrigger() {
  return (
    <Suspense fallback={null}>
      <AutoLoginTriggerInner />
    </Suspense>
  );
}
