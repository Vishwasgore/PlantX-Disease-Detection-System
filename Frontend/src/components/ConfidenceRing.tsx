import { useEffect, useState } from "react";

interface ConfidenceRingProps {
  confidence: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

const ConfidenceRing = ({ 
  confidence, 
  size = 120, 
  strokeWidth = 8,
  showLabel = true 
}: ConfidenceRingProps) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedConfidence / 100) * circumference;

  // Determine health status
  const getStatus = () => {
    if (confidence >= 80) return { label: "High", color: "success" };
    if (confidence >= 50) return { label: "Moderate", color: "warning" };
    return { label: "Low", color: "destructive" };
  };

  const status = getStatus();

  const getGradientColors = () => {
    if (confidence >= 80) return { start: "#22c55e", end: "#16a34a" };
    if (confidence >= 50) return { start: "#eab308", end: "#ca8a04" };
    return { start: "#ef4444", end: "#dc2626" };
  };

  const colors = getGradientColors();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={`confidence-gradient-${confidence}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#confidence-gradient-${confidence})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${colors.start}40)`,
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round(animatedConfidence)}%
          </span>
          <span className={`text-xs font-medium text-${status.color}`}>
            {status.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfidenceRing;
