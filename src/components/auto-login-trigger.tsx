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
      openModal({ type: "login" });
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
