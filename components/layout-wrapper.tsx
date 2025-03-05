"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
