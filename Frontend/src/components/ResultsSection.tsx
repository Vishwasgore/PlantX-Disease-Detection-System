import { Info, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ConfidenceRing from "@/components/ConfidenceRing";
import LeafHealthMeter from "@/components/LeafHealthMeter";
import TinyLLaMAOutput from "@/components/TinyLLaMAOutput";
import BLIPBanner from "@/components/BLIPBanner";
import AIDecisionFlow from "@/components/AIDecisionFlow";

interface Prediction {
  disease: string;
  confidence: number;
}

interface ResultsProps {
  diagnosis: {
    disease: string;
    confidence: number;
    source: "cnn" | "vision-llm";
  };
  predictions: Prediction[];
  advice: {
    explanation: string;
    causes: string[];
    prevention: string[];
    treatment: string[];
  };
  onReset: () => void;
}

const ResultsSection = ({ diagnosis, predictions, advice, onReset }: ResultsProps) => {
  const usedVisionAI = diagnosis.source === "vision-llm";

  return (
    <section className="py-16 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium mb-4">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Analysis Complete
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Plant <span className="text-gradient">Diagnosis</span>
          </h2>
        </div>

        {/* Split-screen layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Panel - Image & Analysis Journey */}
          <div className="lg:col-span-4 space-y-6">
            {/* Analysis Journey - sticky */}
            <div className="lg:sticky lg:top-24">
              <AIDecisionFlow 
                currentStep={5} 
                needsVisionAI={usedVisionAI}
                isSticky={false}
              />
            </div>
          </div>

          {/* Right Panel - Results & AI Output */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* BLIP Banner - if used */}
            {usedVisionAI && (
              <div className="animate-fade-up">
                <BLIPBanner isActive={true} />
              </div>
            )}

            {/* Main Diagnosis Card */}
            <div className="card-organic animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Confidence Ring */}
                <div className="flex-shrink-0">
                  <ConfidenceRing confidence={diagnosis.confidence} size={130} />
                </div>

                {/* Diagnosis Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h3 className="text-2xl font-bold text-foreground cursor-help flex items-center gap-2">
                              {diagnosis.disease}
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </h3>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">
                              This disease was identified using {usedVisionAI ? "Vision AI + LLM analysis" : "CNN classification"} 
                              with {diagnosis.confidence}% confidence.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`
                        text-xs px-3 py-1 rounded-full font-medium
                        ${usedVisionAI 
                          ? "bg-accent/15 text-accent border border-accent/20" 
                          : "bg-primary/15 text-primary border border-primary/20"
                        }
                      `}>
                        {usedVisionAI ? "Vision AI + LLM" : "CNN Classification"}
                      </span>
                    </div>
                  </div>

                  {/* Leaf Health Meter */}
                  <LeafHealthMeter confidence={diagnosis.confidence} />
                </div>
              </div>
            </div>

            {/* Top Predictions */}
            <div className="card-organic animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Top Predictions
              </h4>
              
              <div className="space-y-3">
                {predictions.map((pred, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-foreground truncate">{pred.disease}</span>
                              <span className={`
                                text-sm font-semibold ml-2
                                ${pred.confidence >= 80 ? "text-success" : pred.confidence >= 50 ? "text-warning" : "text-muted-foreground"}
                              `}>
                                {pred.confidence}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                              <div 
                                className={`
                                  h-full rounded-full transition-all duration-700
                                  ${pred.confidence >= 80 ? "bg-success" : pred.confidence >= 50 ? "bg-warning" : "bg-muted-foreground"}
                                `}
                                style={{ width: `${pred.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Click to see more details about {pred.disease}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            {/* TinyLLaMA Output Zone */}
            <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <TinyLLaMAOutput 
                advice={advice} 
                disease={diagnosis.disease}
                isTyping={true}
              />
            </div>

            {/* Action button */}
            <div className="pt-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Button 
                variant="leaf" 
                size="lg" 
                onClick={onReset}
                className="group"
              >
                <Sun className="w-5 h-5 icon-hover" />
                Analyze Another Plant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
