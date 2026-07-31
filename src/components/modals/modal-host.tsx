"use client";

import type { CSSProperties, ReactNode } from "react";
import { useUI } from "@/components/providers/ui-provider";
import { LoginModalContent } from "./login-modal";
import { QuickMatchModalContent } from "./quickmatch-modal";
import { PostModalContent } from "./post-modal";
import { ProfileModalContent } from "./profile-modal";

export function ModalHost() {
  const { modal, closeModal } = useUI();

  if (modal.type === "none") return null;

  let content: ReactNode = null;
  let className = "modal";
  let style: CSSProperties | undefined;

  if (modal.type === "login") {
    content = <LoginModalContent />;
    className = "modal login-modal";
  } else if (modal.type === "quickmatch") {
    content = <QuickMatchModalContent />;
    className = "modal login-modal";
    style = { maxWidth: 420 };
  } else if (modal.type === "post") {
    content = <PostModalContent kind={modal.kind} />;
    className = "modal login-modal";
    style = { maxWidth: 420 };
  } else if (modal.type === "profile") {
    content = <ProfileModalContent id={modal.id} />;
    className = "modal";
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className={className} style={style}>
        {content}
      </div>
    </div>
  );
}
