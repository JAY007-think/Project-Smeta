"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { CheckCircle2, Loader2 } from "lucide-react";

const processingSteps = [
  { id: 1, label: "Uploading data", duration: 800 },
  { id: 2, label: "Processing information", duration: 600 },
  { id: 3, label: "Analyzing symptoms with AI", duration: 0 }, // waits for real API
  { id: 4, label: "Generating triage score", duration: 500 },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function runProcessing() {
      // Check if we already have a result from the previous page
      const preFetchedResult = sessionStorage.getItem("triageResult");

      // Step 0 – Uploading data
      setCurrentStep(0);
      await delay(processingSteps[0].duration);
      if (cancelled) return;
      setCompletedSteps([0]);

      // Step 1 – Processing information
      setCurrentStep(1);
      await delay(processingSteps[1].duration);
      if (cancelled) return;
      setCompletedSteps([0, 1]);

      if (preFetchedResult) {
        // If result already exists, show animations but skip API call
        setCurrentStep(2);
        await delay(800);
        setCompletedSteps([0, 1, 2]);
        setCurrentStep(3);
        await delay(500);
        setCompletedSteps([0, 1, 2, 3]);
        await delay(600);
        if (!cancelled) router.push("/result");
        return;
      }

      // Step 2 – AI Analysis (Fallback if not pre-fetched)
      setCurrentStep(2);
      try {
        const raw = sessionStorage.getItem("emergencyData");
        const emergencyData = raw ? JSON.parse(raw) : null;

        const formData = new FormData();
        formData.append("text", emergencyData?.symptoms || "");
        formData.append("name", emergencyData?.name || "");

        const response = await fetch(`${API_BASE}/api/analyze`, {
          method: "POST",
          body: formData,
        });

        if (!cancelled) {
          const result = await response.json();
          if (result.success) {
            sessionStorage.setItem("triageResult", JSON.stringify(result.data));
          } else {
            setError(result.error || "Analysis failed");
            return;
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("API error:", err);
          sessionStorage.setItem(
            "triageResult",
            JSON.stringify({
              id: "TRG-DEMO",
              triageScore: 3,
              severity: "Medium",
              condition: "Manual Assessment Suggested",
              timestamp: new Date().toISOString().split("T")[0],
            })
          );
        }
      }
      if (cancelled) return;
      setCompletedSteps([0, 1, 2]);

      // Step 3 – Generating triage score
      setCurrentStep(3);
      await delay(processingSteps[3].duration);
      if (cancelled) return;
      setCompletedSteps([0, 1, 2, 3]);

      await delay(600);
      if (!cancelled) router.push("/result");
    }

    runProcessing();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-lg"
          >
            <div className="mb-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Analysis in Progress
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we analyze your emergency data
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {processingSteps.map((step, index) => {
                const isComplete = completedSteps.includes(index);
                const isCurrent = currentStep === index && !isComplete;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
                      isComplete
                        ? "border-success/30 bg-success/5"
                        : isCurrent
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isComplete ? (
                          <motion.div
                            key="complete"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle2 className="h-6 w-6 text-success" />
                          </motion.div>
                        ) : isCurrent ? (
                          <motion.div
                            key="loading"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="pending"
                            className="h-3 w-3 rounded-full bg-muted-foreground/30"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isComplete
                          ? "text-success"
                          : isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(completedSteps.length / processingSteps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {completedSteps.length} of {processingSteps.length} steps complete
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
