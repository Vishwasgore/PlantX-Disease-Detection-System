import AIDecisionFlow from "@/components/AIDecisionFlow";
import { Loader2 } from "lucide-react";

interface AnalysisProgressProps {
  currentStep: number;
  needsVisionAI: boolean;
}

const AnalysisProgress = ({ currentStep, needsVisionAI }: AnalysisProgressProps) => {
  return (
    <section className="py-16 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Processing
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Analyzing Your Plant Leaf
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our multi-stage AI pipeline is examining your image
          </p>
        </div>

        {/* Centered decision flow */}
        <div className="flex justify-center">
          <AIDecisionFlow 
            currentStep={currentStep}
            needsVisionAI={needsVisionAI}
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>
    </section>
  );
};

export default AnalysisProgress;
