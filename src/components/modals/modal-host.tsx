"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useUI } from "@/components/providers/ui-provider";
import { LoginModalContent } from "./login-modal";
import { QuickMatchModalContent } from "./quickmatch-modal";
import { PostModalContent } from "./post-modal";

export function ModalHost() {
  const { modal, closeModal } = useUI();
  const overlayRef = useRef<HTMLDivElement>(null);
  const open = modal.type !== "none";

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    // Stop the page behind from scrolling/snapping while the popup is open.
    root.classList.add("modal-open");

    // iPhone: the keyboard shrinks the *visual* viewport but not fixed elements,
    // so size the overlay to what's actually visible above the keyboard.
    const vv = window.visualViewport;
    const fit = () => {
      const el = overlayRef.current;
      if (!el || !vv) return;
      el.style.top = `${vv.offsetTop}px`;
      el.style.height = `${vv.height}px`;
    };
    fit();
    vv?.addEventListener("resize", fit);
    vv?.addEventListener("scroll", fit);
    return () => {
      root.classList.remove("modal-open");
      vv?.removeEventListener("resize", fit);
      vv?.removeEventListener("scroll", fit);
    };
  }, [open]);

  if (!open) return null;

  let content: ReactNode = null;
  let className = "modal";
  let style: CSSProperties | undefined;

  if (modal.type === "login") {
    content = <LoginModalContent next={modal.next} />;
    className = "modal login-modal";
  } else if (modal.type === "quickmatch") {
    content = <QuickMatchModalContent />;
    className = "modal login-modal";
    style = { maxWidth: 420 };
  } else if (modal.type === "post") {
    content = <PostModalContent kind={modal.kind} />;
    className = "modal login-modal";
    style = { maxWidth: 420 };
  }

  return (
    <div
      ref={overlayRef}
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      onFocus={(e) => {
        // Bring the field being typed into above the keyboard once it has opened.
        const t = e.target as HTMLElement;
        if (t.matches("input, textarea, select")) {
          setTimeout(() => t.scrollIntoView({ block: "center", behavior: "smooth" }), 300);
        }
      }}
    >
      <div className={className} style={style}>
        {content}
      </div>
    </div>
  );
}
