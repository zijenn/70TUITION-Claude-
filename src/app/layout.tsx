import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { UIProvider } from "@/components/providers/ui-provider";
import { Header } from "@/components/nav/header";
import { ModalHost } from "@/components/modals/modal-host";
import { Toast } from "@/components/toast";
import { AutoLoginTrigger } from "@/components/auto-login-trigger";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "70 Tuition — Find your match in learning",
  description:
    "Not a marketplace. Not a listing site. A place built for one thing — finding the person on the other side of the whiteboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        <AuthSessionProvider>
          <UIProvider>
            <AutoLoginTrigger />
            <Header />
            <main>{children}</main>
            <footer>70 TUITION · A place for learning to take place · No fees, ever</footer>
            <ModalHost />
            <Toast />
          </UIProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
