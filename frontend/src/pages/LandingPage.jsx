import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import lightLanding from "/light-landing.png";
import darkLanding from "/dark-landing.png";
import { FadeIn } from "@/components/animations/FadeIn";
import { SlideIn } from "@/components/animations/SlideIn";
import { ScaleIn } from "@/components/animations/ScaleIn";
import { StaggeredFadeIn } from "@/components/animations/StaggeredFadeIn";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 backdrop-blur-sm border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Sustainable Thrift Marketplace
                </span>
              </div>
            </FadeIn>
            {/* Main heading */}
            <SlideIn direction="up" delay={0.2}>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-primary to-chart-2 bg-clip-text text-transparent">
                    Thriftoria
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                  Discover Unique Thrift Treasures
                </p>
              </div>
            </SlideIn>

            <FadeIn delay={0.3}>
              {/* Description */}
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Shop sustainable fashion that tells a story. Find one-of-a-kind
                pieces, reduce waste, and join the movement towards a more
                eco-conscious wardrobe.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <ScaleIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="group text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Start Exploring Thriftoria
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </ScaleIn>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <StaggeredFadeIn delay={0.5} staggerDelay={0.1}>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    10K+
                  </div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
              </StaggeredFadeIn>

              <StaggeredFadeIn delay={0.5} staggerDelay={0.1}>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    5K+
                  </div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
              </StaggeredFadeIn>

              <StaggeredFadeIn delay={0.5} staggerDelay={0.1}>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sustainable
                  </div>
                </div>
              </StaggeredFadeIn>
            </div>
          </div>

          {/* Right image */}
          <div className="hidden lg:flex order-1 lg:order-2  items-center justify-center">
            <SlideIn direction="right" delay={0.3}>
              <div className="relative">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-chart-2/10 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Image container with light/dark variants */}
                <div className="relative z-10">
                  <img
                    src={lightLanding}
                    alt="Thriftoria mobile app preview showcasing thrift shopping experience"
                    className="scale-200 block dark:hidden w-full max-w-md mx-auto drop-shadow-2xl transition-transform duration-500 ease-out"
                  />
                  <img
                    src={darkLanding}
                    alt="Thriftoria mobile app dark mode preview"
                    className="scale-200 hidden dark:block w-full max-w-md mx-auto drop-shadow-2xl transition-transform duration-500 ease-out"
                  />
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default LandingPage;
