import { useState } from "react";
import { Eye, ChevronDown, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BLIPBannerProps {
  isActive: boolean;
  observation?: string;
}

const BLIPBanner = ({ isActive, observation }: BLIPBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isActive) return null;

  const defaultObservation = "The leaf shows irregular brown patches with yellow halos. Tissue appears water-soaked in affected areas. Pattern suggests fungal infection spreading from leaf edges.";

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Vision AI Activated
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
                    BLIP
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enhanced analysis due to low CNN confidence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <ChevronDown 
                className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} 
              />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Visual Observation
              </p>
              <p className="text-sm text-foreground/80 font-mono leading-relaxed">
                "{observation || defaultObservation}"
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default BLIPBanner;
