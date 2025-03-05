import Link from "next/link";
import { Calendar, Home, LineChart, User } from "lucide-react";
import { Logo } from "./logo";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";

export function Header() {
  const today = new Date();
  const dateFormatLong = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const dateFormatShort = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  return (
    <header className="bg-white sticky top-0 z-10 border-b border-dw-gray/10">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            {/* Desktop date display */}
            <div className="hidden sm:flex items-center gap-2 bg-dw-cream/30 px-4 py-2 rounded-full text-sm hover:bg-dw-cream/50 transition-colors group">
              <Calendar className="h-4 w-4 text-dw-blush group-hover:scale-110 transition-transform" />
              <span className="text-dw-text/80">{dateFormatLong}</span>
            </div>
            {/* Mobile date display */}
            <div className="sm:hidden flex items-center gap-2 bg-dw-cream/30 px-3 py-1.5 rounded-full text-xs">
              <Calendar className="h-3 w-3 text-dw-blush" />
              <span className="text-dw-text/80">{dateFormatShort}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex ml-2 sm:ml-4">
              <SignedIn>
                <div className="sm:hidden flex bg-dw-cream/50 rounded-full p-1">
                  <Link
                    href="/"
                    className="text-dw-text hover:text-dw-blush p-1.5 sm:p-2 rounded-full transition-colors"
                    aria-label="Home"
                  >
                    <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-dw-text hover:text-dw-blush p-1.5 sm:p-2 rounded-full transition-colors"
                    aria-label="Calendar"
                  >
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link
                    href="/insights"
                    className="text-dw-text hover:text-dw-blush p-1.5 sm:p-2 rounded-full transition-colors"
                    aria-label="Insights"
                  >
                    <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link
                    href="/profile"
                    className="text-dw-text hover:text-dw-blush p-1.5 sm:p-2 rounded-full transition-colors"
                    aria-label="Profile"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>

                <ul className="hidden sm:flex space-x-1 bg-dw-cream/50 rounded-full p-1">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center px-3 sm:px-4 py-2 rounded-full text-dw-text hover:bg-dw-blush/10 hover:text-dw-blush transition-colors text-sm sm:text-base"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calendar"
                      className="flex items-center px-3 sm:px-4 py-2 rounded-full text-dw-text hover:bg-dw-blush/10 hover:text-dw-blush transition-colors text-sm sm:text-base"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/insights"
                      className="flex items-center px-3 sm:px-4 py-2 rounded-full text-dw-text hover:bg-dw-blush/10 hover:text-dw-blush transition-colors text-sm sm:text-base"
                    >
                      <LineChart className="h-4 w-4 mr-2" />
                      Insights
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center px-3 sm:px-4 py-2 rounded-full text-dw-text hover:bg-dw-blush/10 hover:text-dw-blush transition-colors text-sm sm:text-base"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </li>
                </ul>
              </SignedIn>
            </nav>

            {/* Authentication Buttons */}
            <div className="flex items-center gap-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-full text-dw-text hover:bg-dw-cream/30 transition-colors text-sm">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-full bg-dw-blush text-white hover:bg-dw-blush/90 transition-colors text-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
