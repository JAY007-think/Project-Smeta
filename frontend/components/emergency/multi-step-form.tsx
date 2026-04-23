"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Activity, 
  Mic, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Shield,
  CheckCircle2
} from "lucide-react";
import { VoiceRecorder } from "./voice-recorder";
import { ImageUploader } from "./image-uploader";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Patient Info", icon: User },
  { id: 2, title: "Symptoms", icon: Activity },
  { id: 3, title: "Media", icon: ImageIcon },
  { id: 4, title: "Review", icon: CheckCircle2 },
];

export function MultiStepEmergencyForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    symptoms: "",
    voiceBase64: null as string | null,
    imageBase64: null as string | null,
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleVoiceRecording = (blob: Blob | null, transcript?: string) => {
    if (!blob) {
      setFormData(prev => ({ ...prev, voiceBase64: null, symptoms: transcript ? (prev.symptoms + " " + transcript).trim() : prev.symptoms }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        voiceBase64: reader.result as string,
        symptoms: transcript ? (prev.symptoms + " " + transcript).trim() : prev.symptoms
      }));
    };
    reader.readAsDataURL(blob);
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setFormData(prev => ({ ...prev, imageBase64: null }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name || "Anonymous");
      formDataToSend.append("age", formData.age || "0");
      formDataToSend.append("gender", formData.gender || "Not specified");
      formDataToSend.append("location", formData.location || "Remote");
      formDataToSend.append("text", formData.symptoms);
      
      // Note: Voice and Image handling depends on how the backend expects them
      // Assuming base64 for now as per the state, but typically you'd send Blobs/Files
      if (formData.imageBase64) {
        // Convert base64 to blob if needed or pass as string if backend handles it
        formDataToSend.append("image", formData.imageBase64);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analyze`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (result.success) {
        sessionStorage.setItem("triageResult", JSON.stringify(result.data));
        toast.success("Analysis complete");
        router.push("/processing"); // This page should show the AI analysis results
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to submit patient data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-muted" />
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all duration-300",
                  isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20 scale-110"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      placeholder="123 Street, City"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Describe Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Explain what happened and how you feel..."
                      className="min-h-[150px] bg-muted/50 resize-none"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm text-primary">
                    <Shield className="h-4 w-4" />
                    AI will analyze your description for triage priority.
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
                  <div className="pt-4 border-t">
                    <Label className="mb-2 block">Upload Injury Photo (Optional)</Label>
                    <ImageUploader onImageSelect={handleImageUpload} />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-muted/30 p-6 space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Patient:</span>
                      <span className="font-medium">{formData.name || "Anonymous"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Age/Location:</span>
                      <span className="font-medium">{formData.age}y • {formData.location || "Internal"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Symptoms Summary:</span>
                      <p className="text-sm line-clamp-3 italic">"{formData.symptoms || "No description provided"}"</p>
                    </div>
                    <div className="flex gap-4">
                       {formData.voiceBase64 && <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Voice Recorded</div>}
                       {formData.imageBase64 && <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Image Uploaded</div>}
                    </div>
                  </div>
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
                    <p className="text-sm text-destructive font-medium">
                      By submitting, you agree that AI assessment is for triage only 
                      and not a final medical diagnosis.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {currentStep < steps.length ? (
          <Button onClick={nextStep}>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            className="bg-destructive hover:bg-destructive/90 text-white min-w-[150px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                Confirm & Analyze
                <Shield className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
