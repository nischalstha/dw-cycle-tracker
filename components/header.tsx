import Link from "next/link";
import { Calendar, Home, LineChart, Menu, User, X, Clock } from "lucide-react";
import { Logo } from "./logo";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const dateTimeFormats = {
    fullDate: currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    shortDate: currentTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    }),
    time: currentTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }),
    weekday: currentTime.toLocaleDateString("en-US", { weekday: "long" }),
    dayMonth: currentTime.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric"
    })
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/insights", label: "Insights", icon: LineChart },
    { href: "/profile", label: "Profile", icon: User }
  ];

  return (
    <>
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto w-full px-3 py-2 sm:container sm:px-4 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left Section: Logo and Time */}
            <div className="flex flex-shrink-0 items-center gap-3 sm:gap-6">
              <div className="w-24 sm:w-32 md:w-40">
                <Logo />
              </div>
              {/* Desktop Time Display */}
              <div className="hidden items-center gap-3 rounded-full bg-gradient-to-r from-dw-cream/30 to-dw-cream/20 px-4 py-2 sm:flex">
                <Clock className="h-4 w-4 text-dw-blush" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-dw-text/90">
                    {dateTimeFormats.time}
                  </span>
                  <span className="text-xs text-dw-text/70">
                    {dateTimeFormats.weekday}, {dateTimeFormats.dayMonth}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section: Navigation and Auth */}
            <div className="flex items-center gap-2 sm:gap-4">
              <SignedIn>
                {/* Desktop Navigation */}
                <nav className="hidden sm:block">
                  <ul className="flex items-center gap-1 rounded-full bg-gradient-to-r from-dw-cream/40 to-dw-cream/20 p-1.5">
                    {navItems.map(item => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 sm:py-2 ${
                            pathname === item.href
                              ? "bg-white text-dw-blush shadow-sm"
                              : "text-dw-text/80 hover:bg-white/60 hover:text-dw-blush hover:shadow-sm"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-dw-cream/40 to-dw-cream/20 text-dw-text/80 transition-colors hover:text-dw-blush sm:hidden"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                {/* User Button - Both Mobile and Desktop */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-9 w-9 rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-transparent hover:ring-dw-blush/40 transition-all",
                      userButtonPopoverCard:
                        "shadow-xl shadow-black/5 border border-dw-cream/20 bg-white",
                      userButtonPopoverActionButton: `rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                        pathname === "/profile"
                          ? "bg-dw-cream/20 text-dw-text"
                          : "hover:bg-dw-cream/20 hover:text-dw-text"
                      }`,
                      userButtonPopoverActionButtonText: "font-medium",
                      userButtonPopoverFooter: "hidden"
                    }
                  }}
                />
              </SignedIn>

              {/* Auth Buttons */}
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="rounded-full px-3 py-2 text-sm font-medium text-dw-text/90 transition-all hover:bg-dw-cream/30">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-full bg-gradient-to-r from-dw-blush to-dw-blush/90 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:from-dw-blush hover:to-dw-blush">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-dw-gray/5 via-dw-gray/10 to-dw-gray/5" />
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-[57px] z-10 bg-white shadow-lg sm:hidden">
          {/* Date and Time Section */}
          <div className="border-b border-dw-gray/5 bg-gradient-to-r from-dw-cream/20 to-transparent px-4 py-3">
            <div className="flex items-center gap-3 text-dw-text/90">
              <Clock className="h-5 w-5 text-dw-blush" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-dw-text">
                  {dateTimeFormats.time}
                </span>
                <span className="text-sm">
                  {dateTimeFormats.weekday}, {dateTimeFormats.dayMonth},{" "}
                  {currentTime.getFullYear()}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="divide-y divide-dw-gray/5">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-dw-cream/20 text-dw-blush"
                    : "text-dw-text/80 hover:bg-dw-cream/10 hover:text-dw-blush"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
