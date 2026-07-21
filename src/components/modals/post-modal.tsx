"use client";

import { useUI } from "@/components/providers/ui-provider";

export function PostModalContent({ kind }: { kind: "tutor" | "student" }) {
  const { closeModal, openModal } = useUI();
  return (
    <>
      <button className="modal-close" onClick={closeModal}>
        ×
      </button>
      <h3 className="serif">Post yourself as a {kind}</h3>
      <p className="sub">Log in first — your listing is saved to your account so you can edit it later.</p>
      <button className="btn-primary" style={{ width: "100%" }} onClick={() => openModal({ type: "login" })}>
        Log in to continue
      </button>
    </>
  );
}
