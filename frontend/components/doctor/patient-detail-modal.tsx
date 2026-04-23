"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Droplets,
  CheckCircle,
  FileText,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  score: number;
  time: string;
  status: "Waiting" | "In Treatment" | "Completed";
  symptoms: string[];
  vitals: {
    bp: string;
    hr: number;
    temp: string;
    spo2: string;
  };
}

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
}

const severityStyles = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-orange-500 text-white",
  Medium: "bg-warning text-warning-foreground",
  Low: "bg-success text-success-foreground",
};

export function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={!!patient} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Patient Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.id} • {patient.age} years old • {patient.gender}
              </p>
            </div>
            <Badge className={severityStyles[patient.severity]}>
              {patient.severity}
            </Badge>
          </div>

          <Separator />

          {/* Condition */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Condition</h4>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{patient.condition}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Triage Score:</span>
              <span className="text-lg font-bold text-foreground">{patient.score}/5</span>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Symptoms</h4>
            <div className="flex flex-wrap gap-2">
              {patient.symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary">
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Vitals */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Vital Signs</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Heart className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="font-semibold text-foreground">{patient.vitals.bp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Heart Rate</p>
                  <p className="font-semibold text-foreground">{patient.vitals.hr} bpm</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold text-foreground">{patient.vitals.temp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">SpO2</p>
                  <p className="font-semibold text-foreground">{patient.vitals.spo2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Begin Treatment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
