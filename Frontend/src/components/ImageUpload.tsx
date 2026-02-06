import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X, Scan, AlertCircle, Sun, Focus, Frame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const ImageUpload = ({ onImageSelect, onAnalyze, isAnalyzing }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    
    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      setError("Please upload a JPG or PNG image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
  };

  const tips = [
    { icon: <Sun className="w-4 h-4" />, label: "Good lighting" },
    { icon: <Focus className="w-4 h-4" />, label: "Focus on leaf" },
    { icon: <Frame className="w-4 h-4" />, label: "Fill frame" },
  ];

  return (
    <section id="upload" className="py-24 relative grain-texture">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Asymmetric header */}
        <div className="max-w-4xl mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
            <Upload className="w-3.5 h-3.5" />
            Image Analysis
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Upload your plant
            <br />
            <span className="text-gradient">leaf image</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Take a clear photo of the affected leaf. Our AI will analyze it for diseases in seconds.
          </p>
        </div>

        {/* Main upload area - asymmetric grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Upload zone - larger on left */}
          <div className="lg:col-span-8">
            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative overflow-hidden p-12 md:p-16 text-center transition-all duration-300 cursor-pointer card-organic
                  ${isDragging ? "scale-[1.01] shadow-elevated border-primary/40" : "hover:shadow-elevated"}
                `}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {/* Leaf-shaped decorative elements */}
                <div className="absolute top-8 right-8 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-accent/5 rounded-full blur-xl" />
                
                <div className="space-y-6 relative">
                  <div 
                    className={`
                      w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 
                      flex items-center justify-center transition-all duration-300 border border-primary/20
                      ${isDragging ? "scale-110 rotate-3" : ""}
                    `}
                  >
                    <Upload className={`w-10 h-10 ${isDragging ? "text-primary animate-bounce" : "text-primary/60"}`} />
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold text-foreground mb-2">
                      {isDragging ? "Drop your image here" : "Drag & drop your leaf image"}
                    </p>
                    <p className="text-muted-foreground">or click anywhere to browse</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>JPG, PNG</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span>Max 10MB</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-scale-in">
                <div className="relative card-organic overflow-hidden p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[450px] object-contain rounded-2xl bg-muted/20"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-4 right-4 w-11 h-11 rounded-xl card-glass flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 hover:scale-105"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <Button 
                  variant="leaf" 
                  size="xl" 
                  className="w-full group"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5 icon-hover" />
                      Analyze Leaf
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 animate-fade-up">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          {/* Tips - smaller on right, offset positioning */}
          <div className="lg:col-span-4 lg:pt-12">
            <div className="card-organic space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Quick Tips
              </h3>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/30 hover-lift"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {tip.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground">{tip.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For best results, ensure the leaf is clearly visible with good lighting. 
                  Avoid shadows and blurry images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;
