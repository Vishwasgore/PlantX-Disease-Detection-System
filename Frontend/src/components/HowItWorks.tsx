import { Upload, Brain, Eye, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      icon: <Upload className="w-5 h-5" />,
      title: "Upload Image",
      description: "Take a photo of the affected plant leaf and upload it to our system",
      color: "primary",
    },
    {
      num: "02",
      icon: <Brain className="w-5 h-5" />,
      title: "CNN Analysis",
      description: "MobileNetV2 model classifies the image against 38+ trained disease categories",
      color: "leaf",
    },
    {
      num: "03",
      icon: <Eye className="w-5 h-5" />,
      title: "Vision AI Check",
      description: "If confidence is low, BLIP Vision AI provides additional visual understanding",
      color: "accent",
    },
    {
      num: "04",
      icon: <MessageSquare className="w-5 h-5" />,
      title: "AI Advisory",
      description: "TinyLLaMA generates expert farming advice based on the diagnosis",
      color: "success",
    },
    {
      num: "05",
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Get Results",
      description: "Receive disease diagnosis, confidence score, and actionable treatment advice",
      color: "primary",
    },
  ];

  const techStack = [
    { name: "MobileNetV2", type: "CNN Model" },
    { name: "BLIP", type: "Vision AI" },
    { name: "TinyLLaMA", type: "Language Model" },
    { name: "< 3 sec", type: "Analysis Time" },
  ];

  return (
    <section id="how-it-works" className="py-24 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric header */}
        <div className="max-w-3xl mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Brain className="w-3.5 h-3.5" />
            AI Pipeline
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            How <span className="text-gradient">PlantX</span> works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Our multi-stage AI pipeline ensures accurate disease detection with intelligent fallback mechanisms
          </p>
        </div>

        {/* Steps - Vertical timeline with asymmetric cards */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-accent/30 to-success/30 hidden md:block" />
          
          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`
                  relative flex flex-col md:flex-row gap-6 animate-fade-up
                  ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="card-organic hover-lift group">
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                        bg-${step.color}/15 text-${step.color} group-hover:scale-110
                      `}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground">{step.num}</span>
                          <h3 className="font-semibold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timeline dot - centered */}
                <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-primary/30 z-10">
                  <div className="w-2 h-2 rounded-full bg-primary m-auto" />
                </div>
                
                {/* Empty space for other side */}
                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack cards - asymmetric grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {techStack.map((tech, i) => (
            <div 
              key={i} 
              className={`
                card-glass p-4 text-center hover-lift animate-fade-up
                ${i === 1 ? "-mt-2" : i === 2 ? "mt-2" : ""}
              `}
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <p className="text-lg font-bold text-gradient">{tech.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tech.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
