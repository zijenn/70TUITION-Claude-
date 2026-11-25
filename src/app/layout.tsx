import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { UIProvider } from "@/components/providers/ui-provider";
import { Header } from "@/components/nav/header";
import { ModalHost } from "@/components/modals/modal-host";
import { BasketDrawer } from "@/components/basket/basket-drawer";
import { Toast } from "@/components/toast";
import { AutoLoginTrigger } from "@/components/auto-login-trigger";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Wordmark only ("70tuition" in the header).
const wordmark = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-wordmark",
  display: "swap",
});

// Dark by default (set on <html> below). Before first paint, switch to light
// only if this visitor chose light before, so the page doesn't flash.
const themeScript = `try{if(localStorage.getItem("theme")==="light")delete document.documentElement.dataset.theme}catch(e){}`;

export const metadata: Metadata = {
  title: "70 Tuition — Find your match in learning",
  description:
    "Not a marketplace. Not a listing site. A place built for one thing — finding the person on the other side of the whiteboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${jakarta.variable} ${wordmark.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AuthSessionProvider>
          <UIProvider>
            <AutoLoginTrigger />
            <Header />
            <main>{children}</main>
            <footer>70 Tuition</footer>
            <ModalHost />
            <BasketDrawer />
            <Toast />
          </UIProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
