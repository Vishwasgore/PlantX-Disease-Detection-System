import { Leaf } from "lucide-react";

interface LeafHealthMeterProps {
  confidence: number;
}

const LeafHealthMeter = ({ confidence }: LeafHealthMeterProps) => {
  const getHealthStatus = () => {
    if (confidence >= 80) return { label: "Healthy Detection", level: 3, color: "success" };
    if (confidence >= 50) return { label: "Warning Level", level: 2, color: "warning" };
    return { label: "Severe Concern", level: 1, color: "destructive" };
  };

  const status = getHealthStatus();

  return (
    <div className="flex items-center gap-4">
      {/* Leaf icons representing health */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`
              relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
              ${level <= status.level 
                ? `bg-${status.color}/20 text-${status.color}` 
                : 'bg-muted/30 text-muted-foreground/30'
              }
            `}
            style={{
              transitionDelay: `${(level - 1) * 150}ms`,
            }}
          >
            <Leaf 
              className={`w-5 h-5 transition-transform duration-300 ${level <= status.level ? 'scale-100' : 'scale-75'}`}
              style={{
                filter: level <= status.level ? `drop-shadow(0 0 4px hsl(var(--${status.color}) / 0.4))` : 'none',
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Status text */}
      <div className="flex flex-col">
        <span className={`text-sm font-semibold text-${status.color}`}>
          {status.label}
        </span>
        <span className="text-xs text-muted-foreground">
          {confidence}% confidence
        </span>
      </div>
    </div>
  );
};

export default LeafHealthMeter;
