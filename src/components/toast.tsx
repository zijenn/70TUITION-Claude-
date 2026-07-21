"use client";

import { useUI } from "@/components/providers/ui-provider";

export function Toast() {
  const { toastMessage, toastShow } = useUI();
  return <div className={`toast${toastShow ? " show" : ""}`}>{toastMessage}</div>;
}
