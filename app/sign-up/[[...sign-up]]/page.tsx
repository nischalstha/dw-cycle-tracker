import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
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
            Begin Your Wellness Journey
          </h1>

          <p className="text-dw-text/60 text-lg leading-relaxed">
            Join our community of women taking control of their health through
            mindful cycle tracking.
          </p>

          <div className="hidden md:block space-y-6 mt-12">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">Easy to Start</h3>
                <p className="text-dw-text/60">
                  Simple setup, immediate insights
                </p>
              </div>
            </div>

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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">Personalized Care</h3>
                <p className="text-dw-text/60">Tailored to your unique cycle</p>
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-dw-text">100% Private</h3>
                <p className="text-dw-text/60">Your data stays yours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up UI */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-soft">
            <SignUp
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
