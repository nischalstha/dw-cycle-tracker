import type React from "react";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DW Cycle Tracker",
  description: "Simple and intuitive menstrual cycle tracking",
  generator: "v0.dev"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${nunito.className} flex flex-col min-h-screen bg-white`}
        >
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
