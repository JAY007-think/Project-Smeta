"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceRecorder } from "./voice-recorder";
import { ImageUploader } from "./image-uploader";
import { AlertCircle, ArrowRight, User, MapPin, Calendar } from "lucide-react";



export function EmergencyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    symptoms: "",
    voiceData: null as Blob | null,
    imageFile: null as File | null,
    imageBase64: null as string | null,
    voiceBase64: null as string | null,
  });

  useEffect(() => {
    // Check for transcript from live-call
    const pendingTranscript = sessionStorage.getItem("pendingCallTranscript");
    if (pendingTranscript) {
      setFormData(prev => ({ 
        ...prev, 
        symptoms: prev.symptoms ? prev.symptoms + "\n\n[CALL TRANSCRIPT]: " + pendingTranscript : "[CALL TRANSCRIPT]: " + pendingTranscript 
      }));
      // Optional: Clear it so it doesn't persist on next reload
      sessionStorage.removeItem("pendingCallTranscript");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Store form data in sessionStorage for the processing page
    sessionStorage.setItem(
      "emergencyData",
      JSON.stringify({
        ...formData,
        voiceData: formData.voiceBase64, // using base64 for session storage
        imageFile: formData.imageBase64, // using base64 for session storage
        submittedAt: new Date().toISOString(),
      })
    );

    // Navigate to processing page
    router.push("/processing");
  };

  const handleVoiceRecording = (blob: Blob | null, transcript?: string) => {
    if (!blob) {
      setFormData((prev) => ({ 
        ...prev, 
        voiceData: null,
        voiceBase64: null,
        symptoms: transcript ? (prev.symptoms ? prev.symptoms + " " + transcript : transcript) : prev.symptoms
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ 
        ...prev, 
        voiceData: blob,
        voiceBase64: reader.result as string,
        symptoms: transcript ? (prev.symptoms ? prev.symptoms + " " + transcript : transcript) : prev.symptoms
      }));
    };
    reader.readAsDataURL(blob);
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null, imageBase64: null }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageFile: file, imageBase64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter patient name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              min="0"
              max="150"
              value={formData.age}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, age: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Current location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Symptoms Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
            Symptoms Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms</Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms in detail. Include when they started, severity, and any relevant medical history..."
              className="min-h-[120px] resize-none"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, symptoms: e.target.value }))
              }
              required={!formData.voiceData && !formData.imageFile}
            />
          </div>

          {/* Voice Recording */}
          <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Upload Injury Image (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader onImageSelect={handleImageUpload} />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Analyze Emergency
            <ArrowRight className="h-5 w-5" />
          </span>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your data is encrypted and processed securely in compliance with HIPAA regulations.
      </p>
    </form>
  );
}
