import { AlertTriangle, Camera, Sun, Focus, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BLIPBanner from "@/components/BLIPBanner";

interface UncertainResultProps {
  onReset: () => void;
  attemptedAnalysis: boolean;
}

const UncertainResult = ({ onReset, attemptedAnalysis }: UncertainResultProps) => {
  const tips = [
    { icon: <Sun className="w-4 h-4" />, text: "Use better lighting" },
    { icon: <Focus className="w-4 h-4" />, text: "Focus on the leaf" },
    { icon: <Camera className="w-4 h-4" />, text: "Get closer to the plant" },
  ];

  return (
    <section className="py-16 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* BLIP Banner */}
          {attemptedAnalysis && (
            <div className="animate-fade-up">
              <BLIPBanner 
                isActive={true} 
                observation="Image quality or subject matter made confident classification difficult. The visual features did not clearly match known disease patterns."
              />
            </div>
          )}

          {/* Main message card */}
          <div className="card-organic text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-warning/15 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-warning" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Uncertain Result
            </h2>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              The uploaded image doesn't clearly match any trained plant diseases. 
              This could be a healthy plant or an unrecognized condition.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Vision AI was used but couldn't provide a confident diagnosis
              </span>
            </div>

            {/* Tips */}
            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {tips.map((tip, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {tip.icon}
                  </div>
                  <span className="text-sm text-muted-foreground">{tip.text}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="leaf" 
                size="lg" 
                onClick={onReset}
                className="group"
              >
                <Upload className="w-5 h-5 icon-hover" />
                Try Another Image
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onReset}
                className="hover-lift"
              >
                <RefreshCw className="w-5 h-5" />
                Start Over
              </Button>
            </div>
          </div>

          {/* Suggestion card */}
          <div className="card-glass p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              💡 Pro Tip
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For best results, take photos in natural daylight, focus on a single leaf, 
              and make sure the affected area fills most of the frame. Avoid shadows and blurry images.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UncertainResult;