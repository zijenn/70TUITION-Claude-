import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: { default: "70tuition — Free tutor board for Singapore", template: "%s | 70tuition" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["70tuition", "70 tuition", "tuition Singapore", "private tutor Singapore", "find a tutor", "home tuition"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, url: SITE_URL, title: "70tuition — Free tutor board for Singapore", description: SITE_DESCRIPTION, locale: "en_SG" },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

// Tells Google the site's name ("70tuition") so it shows in search results.
const siteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: ["70 Tuition", "70tuition.com"],
  url: SITE_URL,
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${jakarta.variable} ${wordmark.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLd }} />
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
