import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import AnalysisProgress from "@/components/AnalysisProgress";
import ResultsSection from "@/components/ResultsSection";
import UncertainResult from "@/components/UncertainResult";
import HowItWorks from "@/components/HowItWorks";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

type AppState = "idle" | "analyzing" | "results" | "uncertain";

interface BackendResponse {
  success: boolean;
  diagnosis: string;
  confidence: number;
  source: string;
  cnn_predictions?: {
    top_3_predictions: {
      disease: string;
      confidence: number;
    }[];
  };
  advice?: {
    explanation?: string;
  };
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<BackendResponse | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAppState("analyzing");
    setCurrentStep(1);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data: BackendResponse = await res.json();

      if (!data.success) {
        setAppState("uncertain");
        return;
      }

      setResult(data);
      setCurrentStep(5);
      setAppState("results");

    } catch (err) {
      console.error(err);
      setAppState("uncertain");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setCurrentStep(0);
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {appState === "idle" && (
        <ImageUpload
          onImageSelect={handleImageSelect}
          onAnalyze={handleAnalyze}
          isAnalyzing={false}
        />
      )}

      {appState === "analyzing" && (
        <AnalysisProgress currentStep={currentStep} needsVisionAI={false} />
      )}

      {appState === "results" && result && (
        <ResultsSection
          diagnosis={{
            disease: result.diagnosis,
            confidence: Math.round(result.confidence * 100),
            source: result.source.includes("BLIP") ? "vision-llm" : "cnn",
          }}
          predictions={
            result.cnn_predictions?.top_3_predictions.map(p => ({
              disease: p.disease,
              confidence: Math.round(p.confidence * 100),
            })) ?? []
          }
          advice={{
            explanation: result.advice?.explanation ?? "No advisory available",
            causes: [],
            prevention: [],
            treatment: [],
          }}
          onReset={handleReset}
        />
      )}

      {appState === "uncertain" && (
        <UncertainResult onReset={handleReset} attemptedAnalysis={true} />
      )}

      <HowItWorks />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
