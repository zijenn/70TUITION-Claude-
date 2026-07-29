"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useUI } from "@/components/providers/ui-provider";
import { BasketIcon } from "@/components/icons";

const TABS = [
  { href: "/tutors", label: "Tutors" },
  { href: "/students", label: "Students" },
  { href: "/centers", label: "Centers" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { openModal, showToast, shortlistCount, openBasket } = useUI();

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
            <button className="basket-btn" onClick={openBasket} aria-label="Open shortlist">
              <BasketIcon />
              {shortlistCount > 0 && <span className="basket-count">{shortlistCount}</span>}
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
