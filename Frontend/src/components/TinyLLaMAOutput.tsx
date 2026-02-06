import { useState, useEffect } from "react";
import { Sprout, AlertTriangle, Shield, Droplets, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TinyLLaMAOutputProps {
  advice: {
    explanation: string;
    causes: string[];
    prevention: string[];
    treatment: string[];
  };
  disease: string;
  isTyping?: boolean;
}

const TinyLLaMAOutput = ({ advice, disease, isTyping = false }: TinyLLaMAOutputProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(!isTyping);
  const [expandedSections, setExpandedSections] = useState<string[]>(["summary"]);

  const fullText = advice.explanation;

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(fullText);
      setIsTypingComplete(true);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [fullText, isTyping]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: "causes",
      title: "Why This Disease?",
      icon: <AlertTriangle className="w-4 h-4" />,
      items: advice.causes,
      color: "warning",
    },
    {
      id: "treatment",
      title: "Treatment Advice",
      icon: <Droplets className="w-4 h-4" />,
      items: advice.treatment,
      color: "success",
    },
    {
      id: "prevention",
      title: "Prevention Tips",
      icon: <Shield className="w-4 h-4" />,
      items: advice.prevention,
      color: "primary",
    },
  ];

  return (
    <div className="notebook-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            🌱 PlantX AI Advisor
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              TinyLLaMA
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">Agricultural Intelligence Report</p>
        </div>
      </div>

      {/* Diagnosis Summary */}
      <Collapsible 
        open={expandedSections.includes("summary")}
        onOpenChange={() => toggleSection("summary")}
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-foreground">Diagnosis Summary</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.includes("summary") ? "rotate-180" : ""}`} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-3 p-4 rounded-lg bg-cream/50 border border-border/30">
            <div className="font-mono text-sm text-foreground/90 leading-relaxed">
              <span className="text-primary font-semibold">&gt; Detected:</span>{" "}
              <span className="text-accent font-medium">{disease}</span>
              <br /><br />
              <span className="text-primary font-semibold">&gt; Analysis:</span>{" "}
              <span className={isTypingComplete ? "" : "typing-cursor"}>
                {displayedText}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Other sections */}
      <div className="mt-4 space-y-2">
        {sections.map((section) => (
          <Collapsible 
            key={section.id}
            open={expandedSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <CollapsibleTrigger className="w-full">
              <div className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-${section.color}/5 border border-transparent hover:border-${section.color}/20`}>
                <div className="flex items-center gap-2">
                  <div className={`text-${section.color}`}>
                    {section.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{section.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {section.items.length}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSections.includes(section.id) ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-2 space-y-2">
                {section.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-3 p-2 rounded-lg font-mono text-xs text-muted-foreground"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className={`text-${section.color} font-medium shrink-0`}>
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Footer timestamp */}
      <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
        <span>Generated by TinyLLaMA v1.1</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default TinyLLaMAOutput;
