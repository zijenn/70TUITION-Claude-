"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { BasketIcon, ChatIcon } from "@/components/icons";
import type { ConversationSummary } from "@/types";

const TABS = [
  { href: "/tutors", label: "Tutors" },
  { href: "/students", label: "Students" },
  { href: "/centers", label: "Centers" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { openModal, showToast, shortlistCount, openBasket } = useUI();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") {
      setUnreadCount(0);
      return;
    }
    let cancelled = false;
    fetch("/api/messages")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ConversationSummary[]) => {
        if (!cancelled) setUnreadCount(data.filter((c) => c.unread).length);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [status, pathname]);

  async function handleAuthClick() {
    if (status === "authenticated") {
      await signOut({ redirect: false });
      showToast("Logged out.");
    } else {
      openModal({ type: "login" });
    }
  }

  return (
    <header>
      <div className="nav-inner">
        <Link href="/" className="logo-btn">
          <span className="logo-mark">70</span>
          <span className="logo-word">Tuition</span>
        </Link>
        <nav className="tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-btn${pathname?.startsWith(tab.href) ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {status === "authenticated" && (
            <Link href="/messages" className="header-icon-btn" aria-label="Open chats">
              <ChatIcon />
              {unreadCount > 0 && <span className="header-icon-badge">{unreadCount}</span>}
            </Link>
          )}
          {status === "authenticated" && (
            <button className="header-icon-btn" onClick={openBasket} aria-label="Open shortlist">
              <BasketIcon />
              {shortlistCount > 0 && <span className="header-icon-badge">{shortlistCount}</span>}
            </button>
          )}
          <button className="login-btn" onClick={handleAuthClick}>
            {status === "authenticated" ? `Log out (${session?.user?.name?.split(" ")[0] ?? "Account"})` : "Log in"}
          </button>
        </div>
      </div>
    </header>
  );
}
