import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-dw-gray/10 py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Logo />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-2">
            <Link
              href="/privacy"
              className="text-sm text-dw-text hover:text-dw-blush transition-colors hover:-translate-y-0.5 transform duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-dw-text hover:text-dw-blush transition-colors hover:-translate-y-0.5 transform duration-200"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-dw-text hover:text-dw-blush transition-colors hover:-translate-y-0.5 transform duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center text-sm text-dw-text/60">
          <p className="flex items-center justify-center">
            Made with{" "}
            <Heart className="h-4 w-4 mx-1 text-dw-blush animate-pulse" /> for
            my girlfriend
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} DW. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
