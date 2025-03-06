import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Heart, Sparkles, Brain, Clock, Flower } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-tl from-white via-dw-cream/10 to-dw-sage/5">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-4 top-0 h-64 w-64 rounded-full bg-dw-sage/10 blur-3xl" />
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-dw-blush/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-dw-lavender/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <div className="relative mx-auto flex w-full max-w-[400px] flex-col items-center lg:max-w-none lg:flex-row-reverse lg:items-stretch lg:gap-8">
            {/* Left Column - Welcome Content */}
            <div className="relative z-10 mb-8 w-full text-center lg:mb-0 lg:flex-1 lg:text-left">
              <div className="mb-6 lg:mb-12">
                <Image
                  src="/dw-logo.png"
                  alt="DW."
                  width={180}
                  height={60}
                  priority
                />
              </div>

              <h1 className="mb-4 font-light tracking-tight text-dw-text lg:max-w-xl">
                <span className="block text-3xl sm:text-4xl lg:text-5xl">
                  Start Your Journey
                </span>
                <span className="mt-2 block bg-gradient-to-r from-dw-sage to-dw-blush bg-clip-text text-4xl text-transparent sm:text-5xl lg:text-6xl">
                  With Love & Care
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-md text-base text-dw-text/60 sm:text-lg lg:mx-0 lg:text-xl">
                Join our community of women taking control of their health
                through mindful cycle tracking.
              </p>

              {/* Feature Cards */}
              <div className="hidden lg:block">
                <div className="grid gap-6 lg:grid-cols-2">
                  {[
                    {
                      title: "Easy to Start",
                      description:
                        "Begin your wellness journey with a simple setup process that gets you tracking right away",
                      color: "bg-dw-sage/10",
                      textColor: "text-dw-sage",
                      icon: Sparkles,
                      gradient: "from-dw-sage/20 to-transparent"
                    },
                    {
                      title: "Smart Tracking",
                      description:
                        "Intelligent analysis helps you understand your unique patterns and rhythms",
                      color: "bg-dw-blush/10",
                      textColor: "text-dw-blush",
                      icon: Brain,
                      gradient: "from-dw-blush/20 to-transparent"
                    },
                    {
                      title: "Cycle Insights",
                      description:
                        "Get personalized predictions and gentle reminders for each phase of your cycle",
                      color: "bg-dw-lavender/10",
                      textColor: "text-dw-text",
                      icon: Clock,
                      gradient: "from-dw-lavender/20 to-transparent"
                    },
                    {
                      title: "Health & Wellness",
                      description:
                        "Nurture your well-being with holistic cycle awareness and care",
                      color: "bg-dw-cream/30",
                      textColor: "text-dw-text",
                      icon: Flower,
                      gradient: "from-dw-cream/40 to-transparent"
                    }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-white/80 to-white/50 p-6 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:bg-white/90 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-white/40"
                    >
                      <div
                        className={`absolute -right-8 -top-8 h-40 w-40 rounded-full ${feature.color} opacity-50 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-80`}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                      />
                      <div className="relative space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-xl bg-white/80 p-2 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md ${feature.textColor}`}
                          >
                            <feature.icon className="h-5 w-5" />
                          </div>
                          <h3
                            className={`text-lg font-medium tracking-tight ${feature.textColor}`}
                          >
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-dw-text/75">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sign Up Form */}
            <div className="w-full lg:max-w-md">
              <div className="overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl">
                <div className="p-4 sm:p-8">
                  <SignUp
                    appearance={{
                      elements: {
                        formButtonPrimary:
                          "bg-gradient-to-r from-dw-sage to-dw-sage/90 text-white w-full py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]",
                        card: "bg-transparent shadow-none",
                        headerTitle:
                          "text-dw-text text-2xl font-light tracking-tight",
                        headerSubtitle: "text-dw-text/60 text-base",
                        socialButtonsBlockButton:
                          "border-dw-cream bg-white hover:bg-dw-cream/5 hover:border-dw-sage/20 transition-all duration-300 w-full py-3 rounded-xl shadow-sm hover:shadow-md",
                        socialButtonsBlockButtonText: "text-dw-text",
                        formFieldInput:
                          "h-12 rounded-xl border-dw-cream bg-white/70 focus:bg-white transition-all duration-300 focus:border-dw-sage/50 focus:ring-dw-sage/50 hover:border-dw-sage/30",
                        footerActionLink:
                          "text-dw-sage hover:text-dw-sage/80 transition-colors",
                        formFieldLabel: "text-dw-text/80 font-medium",
                        dividerLine: "bg-dw-cream",
                        dividerText: "text-dw-text/40",
                        formFieldLabelRow: "mb-2",
                        formFieldRow: "mb-4",
                        rootBox: "bg-transparent",
                        main: "bg-transparent"
                      },
                      layout: {
                        socialButtonsPlacement: "bottom",
                        shimmer: true
                      }
                    }}
                  />
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 text-center">
                <p className="flex items-center justify-center gap-2 text-sm text-dw-text/40">
                  Made with <Heart className="h-4 w-4 text-dw-sage" /> for my
                  girlfriend
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
