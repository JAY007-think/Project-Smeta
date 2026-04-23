"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  User,
  Activity,
  Clock,
  Stethoscope,
  ArrowRight,
  Home,
  FileText,
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low" | "Non-Urgent";

interface TriageResult {
  id: string;
  triageScore: number;
  severity: Severity;
  condition: string;
  confidence: string;
  recommendedAction: string;
  estimatedWaitTime?: string;
  symptoms?: string[];
  timestamp?: string;
  imageUrl?: string;
  source?: string;
}

const severityConfig: Record<string, {
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
}> = {
  Critical: {
    color: "bg-destructive",
    textColor: "text-destructive",
    bgLight: "bg-destructive/10",
    borderColor: "border-destructive/30",
  },
  High: {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgLight: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  Medium: {
    color: "bg-warning",
    textColor: "text-yellow-600",
    bgLight: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  Low: {
    color: "bg-success",
    textColor: "text-success",
    bgLight: "bg-success/10",
    borderColor: "border-success/30",
  },
  "Non-Urgent": {
    color: "bg-success",
    textColor: "text-success",
    bgLight: "bg-success/10",
    borderColor: "border-success/30",
  },
};

const defaultResult: TriageResult = {
  id: "TRG-DEMO",
  triageScore: 2,
  severity: "High",
  condition: "Chest Pain with Shortness of Breath",
  confidence: "87%",
  recommendedAction: "Immediate ECG and cardiac enzyme tests. Patient should be seen within 10 minutes.",
  estimatedWaitTime: "5-10 minutes",
  symptoms: [
    "Sharp chest pain radiating to left arm",
    "Difficulty breathing",
    "Sweating",
    "Nausea",
  ],
};

export default function ResultPage() {
  const [result, setResult] = useState<TriageResult>(defaultResult);
  const [showAlert, setShowAlert] = useState(false);
  const [patientName, setPatientName] = useState("Patient");

  useEffect(() => {
    // Load real result from API (stored in sessionStorage by processing page)
    const stored = sessionStorage.getItem("triageResult");
    if (stored) {
      try {
        const parsed: TriageResult = JSON.parse(stored);
        setResult(parsed);
      } catch (_) {}
    }

    // Load patient name
    const emergencyData = sessionStorage.getItem("emergencyData");
    if (emergencyData) {
      try {
        const ed = JSON.parse(emergencyData);
        if (ed.name) setPatientName(ed.name);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (result.severity === "Critical" || result.severity === "High") {
      setShowAlert(true);
    }
  }, [result.severity]);

  const severity = severityConfig[result.severity] ?? severityConfig["Low"];
  const isCritical = result.severity === "Critical" || result.severity === "High";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {/* Critical Alert Banner */}
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 overflow-hidden rounded-xl border-2 ${severity.borderColor} ${severity.bgLight}`}
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${severity.color} animate-pulse`}>
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-lg font-bold ${severity.textColor}`}>
                      {result.severity === "Critical" ? "Critical Emergency Alert" : "High Priority Alert"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This patient requires immediate medical attention
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAlert(false)}
                    className="shrink-0"
                  >
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Main Result Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Triage Assessment Result
                    </CardTitle>
                    <Badge variant="outline" className="font-mono">
                      ID: {result.id || `TRG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Patient Info */}
                  <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{patientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {result.timestamp ? `Analyzed on ${result.timestamp}` : "Just analyzed"}
                      </p>
                    </div>
                  </div>

                  {/* Severity Score */}
                  <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className={`rounded-xl border-2 ${severity.borderColor} ${severity.bgLight} p-4 text-center`}>
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Severity Level
                      </div>
                      <div className={`mt-1 text-2xl font-bold ${severity.textColor}`}>
                        {result.severity}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Triage Score
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <span className={`text-3xl font-bold ${severity.textColor}`}>
                          {result.triageScore}
                        </span>
                        <span className="text-lg text-muted-foreground">/ 5</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        AI Confidence
                      </div>
                      <div className="mt-1 text-2xl font-bold text-primary">
                        {result.confidence}
                      </div>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-6">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Predicted Condition
                    </h4>
                    <p className="text-lg font-semibold text-foreground">
                      {result.condition}
                    </p>
                  </div>

                  {/* Symptoms */}
                  {result.symptoms && result.symptoms.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        Identified Symptoms
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.symptoms.map((symptom) => (
                          <Badge key={symptom} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                      <Stethoscope className="h-4 w-4" />
                      Recommended Action
                    </h4>
                    <p className="text-sm text-foreground">
                      {result.recommendedAction}
                    </p>
                  </div>

                  {/* Wait Time */}
                  {result.estimatedWaitTime && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                      <Clock className={`h-6 w-6 ${severity.textColor}`} />
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Wait Time</div>
                        <div className={`text-lg font-bold ${severity.textColor}`}>
                          {result.estimatedWaitTime}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild className="flex-1">
                <Link href="/doctor">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  View Doctor Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/emergency">
                  Submit New Emergency
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
            </motion.div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              This assessment is generated by AI and should be verified by medical professionals.
              In case of life-threatening emergency, call emergency services immediately.
            </p>

            {result.source && (
              <div className="mt-8 text-center text-sm font-medium text-muted-foreground pb-4">
                Analysis Provider: <span className="text-primary font-bold">{result.source}</span>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
