import { ArrowDown, Scan, Leaf, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.jpg";

const HeroSection = () => {
  const scrollToUpload = () => {
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden grain-texture">
      {/* Background with organic shapes */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      
      {/* Organic blob decorations */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 blob-shape animate-blob blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-accent/5 blob-shape animate-blob blur-3xl" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-leaf-light/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric grid layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* Left content - spans 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full card-glass animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-foreground">AI-Powered Agriculture</span>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </div>
            
            {/* Main heading with asymmetric styling */}
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
                Plant Disease
                <br />
                <span className="text-gradient">Detection</span> that
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">actually works</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C50 4 150 4 198 8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Description - offset for asymmetry */}
            <p 
              className="text-lg text-muted-foreground max-w-lg leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Upload a leaf photo. Get instant diagnosis with expert farming advice. 
              Powered by a multi-stage AI pipeline for results you can trust.
            </p>

            {/* CTA buttons */}
            <div 
              className="flex flex-wrap gap-4 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button 
                variant="leaf" 
                size="xl" 
                onClick={scrollToUpload}
                className="group"
              >
                <Scan className="w-5 h-5 icon-hover" />
                Analyze Plant Leaf
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="hover-lift"
              >
                <Leaf className="w-5 h-5" />
                See How It Works
              </Button>
            </div>

            {/* Stats - asymmetric card layout */}
            <div 
              className="flex flex-wrap gap-3 pt-4 animate-fade-up"
              style={{ animationDelay: "0.5s" }}
            >
              {[
                { icon: <TrendingUp className="w-4 h-4" />, value: "38+", label: "Diseases" },
                { icon: <Zap className="w-4 h-4" />, value: "95%", label: "Accuracy" },
                { icon: <Sparkles className="w-4 h-4" />, value: "<3s", label: "Analysis" },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="card-glass px-5 py-3 flex items-center gap-3 hover-lift"
                >
                  <div className="text-primary">{stat.icon}</div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual - spans 5 columns with offset */}
          <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {/* Main image with organic curve */}
            <div className="relative">
              <div 
                className="relative overflow-hidden shadow-elevated glow-leaf"
                style={{ borderRadius: "60% 40% 45% 55% / 50% 55% 45% 50%" }}
              >
                <img 
                  src={heroImage} 
                  alt="AI Plant Disease Detection" 
                  className="w-full h-auto object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating card - top left, overlapping */}
              <div 
                className="absolute -left-6 top-8 card-glass p-4 shadow-card animate-float hover-lift"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-success/20 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Healthy Leaf</p>
                    <p className="text-xs text-muted-foreground">98% Confidence</p>
                  </div>
                </div>
              </div>
              
              {/* Floating card - bottom right, overlapping */}
              <div 
                className="absolute -right-4 -bottom-4 card-glass p-4 shadow-card animate-float hover-lift"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Analysis</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <p className="text-xs text-muted-foreground">Processing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - asymmetric positioning */}
        <div className="absolute bottom-8 left-8 animate-bounce">
          <div 
            className="w-12 h-12 rounded-2xl card-glass flex items-center justify-center cursor-pointer hover-lift"
            onClick={scrollToUpload}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
