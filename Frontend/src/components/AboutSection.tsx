import { Leaf, Users, GraduationCap, FlaskConical, Check } from "lucide-react";

const AboutSection = () => {
  const audiences = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Farmers",
      description: "Get quick diagnosis for crop diseases and actionable treatment advice in simple language",
      color: "primary",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Agriculture Students",
      description: "Learn about plant pathology and AI applications in modern agriculture",
      color: "accent",
    },
    {
      icon: <FlaskConical className="w-5 h-5" />,
      title: "Researchers",
      description: "Explore multi-model AI pipeline architecture for agricultural applications",
      color: "success",
    },
  ];

  const features = [
    "Multi-model AI pipeline for accurate detection",
    "Supports 38+ common plant diseases",
    "Farmer-friendly language, no technical jargon",
    "Works even with low-quality or unusual images",
    "Instant results in under 3 seconds",
    "Practical treatment and prevention advice",
  ];

  return (
    <section id="about" className="py-24 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cream/30 to-background" />
      
      {/* Organic shapes */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-primary/5 blob-shape blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-accent/5 blob-shape blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric grid layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-leaf text-xs font-medium mb-4">
                <Leaf className="w-3.5 h-3.5" />
                About PlantX
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                AI for <span className="text-gradient">Smart Agriculture</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                PlantX combines cutting-edge AI models to provide accurate plant disease detection 
                and practical farming advice, making advanced technology accessible to everyone.
              </p>
            </div>

            {/* Feature list */}
            <div className="card-organic animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Why PlantX?
              </h3>
              <div className="grid gap-3">
                {features.map((feature, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Audience cards with staggered layout */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 content-start">
            {audiences.map((item, index) => (
              <div 
                key={index} 
                className={`
                  card-organic hover-lift animate-fade-up
                  ${index === 1 ? "sm:translate-y-8" : ""}
                  ${index === 2 ? "sm:col-span-2 lg:col-span-1 lg:translate-y-4" : ""}
                `}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-${item.color}/15 flex items-center justify-center text-${item.color} mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
            
            {/* Extra decorative card */}
            <div 
              className="hidden lg:block card-glass p-6 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <p className="text-2xl font-bold text-gradient">38+</p>
                <p className="text-xs text-muted-foreground mt-1">Plant Diseases Detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
