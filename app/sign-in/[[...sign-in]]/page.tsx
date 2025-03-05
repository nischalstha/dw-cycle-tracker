import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-dw-cream/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[1200px] grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Welcome content */}
        <div className="text-center md:text-left space-y-6 p-8">
          <div className="mb-8">
            <Image
              src="/dw-logo.png"
              alt="DW Cycle Tracker"
              width={180}
              height={60}
              className="mx-auto md:mx-0"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-light text-dw-text">
            Welcome Back, Darling
          </h1>

          <p className="text-dw-text/60 text-lg leading-relaxed">
            I made this just for you - to help track your cycle with ease and care. 
            Let's stay in sync together.
          </p>

          <div className="hidden md:block space-y-6 mt-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-dw-blush/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dw-blush"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">
                  Personalized Tracking
                </h3>
                <p className="text-dw-text/60">
                  Understand your unique cycle patterns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-dw-sage/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dw-sage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">
                  Intuitive Predictions
                </h3>
                <p className="text-dw-text/60">
                  Stay prepared with accurate forecasts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-dw-lavender/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dw-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">Private & Secure</h3>
                <p className="text-dw-text/60">Your data is always protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In UI */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-soft">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-dw-blush hover:bg-dw-blush/90 text-white",
                  card: "bg-transparent shadow-none",
                  headerTitle: "text-dw-text text-xl",
                  headerSubtitle: "text-dw-text/60",
                  socialButtonsBlockButton:
                    "border-dw-cream hover:border-dw-blush/20 transition-colors",
                  socialButtonsBlockButtonText: "text-dw-text",
                  formFieldInput:
                    "rounded-xl border-dw-cream focus:border-dw-blush/50 focus:ring-dw-blush/50",
                  footerActionLink: "text-dw-blush hover:text-dw-blush/80"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
