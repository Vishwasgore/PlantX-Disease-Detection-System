import { useState } from "react";
import { 
  Image, 
  Brain, 
  Gauge, 
  Eye, 
  MessageSquare, 
  ChevronDown,
  Check,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Step {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  icon: React.ReactNode;
  status: "pending" | "loading" | "complete" | "warning" | "skipped";
}

interface AIDecisionFlowProps {
  currentStep: number;
  needsVisionAI: boolean;
  isSticky?: boolean;
}

const AIDecisionFlow = ({ currentStep, needsVisionAI, isSticky = false }: AIDecisionFlowProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 0,
      title: "Image Received",
      shortTitle: "Image",
      description: "Leaf image captured and preprocessed",
      detail: "The uploaded image is resized to 224×224 pixels and normalized for the CNN model. Color channels are adjusted to match training data distribution.",
      icon: <Image className="w-4 h-4" />,
      status: currentStep >= 1 ? "complete" : "pending",
    },
    {
      id: 1,
      title: "CNN Analysis",
      shortTitle: "CNN",
      description: "MobileNetV2 processing image",
      detail: "A pre-trained MobileNetV2 model fine-tuned on 38 plant disease classes analyzes visual features like leaf texture, color patterns, and spot formations.",
      icon: <Brain className="w-4 h-4" />,
      status: currentStep > 1 ? "complete" : currentStep === 1 ? "loading" : "pending",
    },
    {
      id: 2,
      title: "Confidence Check",
      shortTitle: "Check",
      description: "Evaluating prediction reliability",
      detail: "The system checks if the CNN's top prediction exceeds the confidence threshold (typically 70%). Low confidence triggers the Vision AI fallback.",
      icon: <Gauge className="w-4 h-4" />,
      status: currentStep > 2 
        ? (needsVisionAI ? "warning" : "complete") 
        : currentStep === 2 ? "loading" : "pending",
    },
    {
      id: 3,
      title: "BLIP Vision Analysis",
      shortTitle: "BLIP",
      description: "Visual understanding model activated",
      detail: "BLIP (Bootstrapping Language-Image Pre-training) generates a natural language description of the leaf's visual features, capturing details the CNN might miss.",
      icon: <Eye className="w-4 h-4" />,
      status: needsVisionAI 
        ? (currentStep > 3 ? "complete" : currentStep === 3 ? "loading" : "pending")
        : "skipped",
    },
    {
      id: 4,
      title: "TinyLLaMA Reasoning",
      shortTitle: "LLaMA",
      description: "Generating agricultural advice",
      detail: "TinyLLaMA processes the diagnosis and visual understanding to generate farmer-friendly treatment advice, prevention tips, and actionable recommendations.",
      icon: <MessageSquare className="w-4 h-4" />,
      status: currentStep > 4 ? "complete" : currentStep === 4 ? "loading" : "pending",
    },
  ];

  const getStatusStyles = (status: Step["status"]) => {
    switch (status) {
      case "complete":
        return {
          bg: "bg-success/15",
          border: "border-success/30",
          text: "text-success",
          icon: <Check className="w-3.5 h-3.5" />,
        };
      case "loading":
        return {
          bg: "bg-primary/15",
          border: "border-primary/30",
          text: "text-primary",
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
        };
      case "warning":
        return {
          bg: "bg-warning/15",
          border: "border-warning/30",
          text: "text-warning",
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      case "skipped":
        return {
          bg: "bg-muted/50",
          border: "border-border/50",
          text: "text-muted-foreground/50",
          icon: null,
        };
      default:
        return {
          bg: "bg-secondary",
          border: "border-border",
          text: "text-muted-foreground",
          icon: null,
        };
    }
  };

  return (
    <div 
      className={`
        w-full max-w-sm space-y-1
        ${isSticky ? 'sticky top-24' : ''}
      `}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Analysis Journey
        </h3>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-border to-border" />

        <div className="space-y-1">
          {steps.map((step) => {
            const styles = getStatusStyles(step.status);
            const isExpanded = expandedStep === step.id;

            return (
              <Collapsible 
                key={step.id} 
                open={isExpanded}
                onOpenChange={(open) => setExpandedStep(open ? step.id : null)}
              >
                <CollapsibleTrigger className="w-full">
                  <div 
                    className={`
                      relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group
                      ${step.status === "loading" ? "bg-primary/5" : "hover:bg-secondary/50"}
                      ${step.status === "skipped" ? "opacity-50" : ""}
                    `}
                  >
                    {/* Step icon */}
                    <div 
                      className={`
                        relative z-10 w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-300
                        ${styles.bg} ${styles.border} ${styles.text}
                      `}
                    >
                      {styles.icon || step.icon}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${step.status === "skipped" ? "text-muted-foreground/50" : "text-foreground"}`}>
                          {step.title}
                        </span>
                        {step.status === "loading" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                            Active
                          </span>
                        )}
                        {step.status === "warning" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-warning/20 text-warning font-medium">
                            Low
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    </div>

                    {/* Expand icon */}
                    {step.status !== "skipped" && (
                      <ChevronDown 
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-[3.25rem] mr-2 mb-2 p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AIDecisionFlow;
