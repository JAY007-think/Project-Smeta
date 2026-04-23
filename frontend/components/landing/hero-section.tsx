"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Shield, Zap, Brain } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-16 md:pb-32 md:pt-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              AI-Powered Emergency Response
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-pretty text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Smart Emergency{" "}
            <span className="text-primary">Triage AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl"
          >
            Multimodal AI that analyzes voice, text, and images to prioritize 
            emergency patients instantly. Reduce wait times, save lives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="min-w-[180px]">
              <Link href="/emergency">
                Start Emergency
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[180px]">
              <Link href="/live-call">
                <Play className="mr-2 h-4 w-4" />
                Live 911 Simulation
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-20 grid max-w-4xl gap-8 md:grid-cols-3"
        >
          {[
            { value: "95%", label: "Accuracy Rate", icon: Brain },
            { value: "<30s", label: "Analysis Time", icon: Zap },
            { value: "HIPAA", label: "Compliant", icon: Shield },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-2 text-xs text-muted-foreground">TriageAI Dashboard</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Active Patients
                </div>
                <div className="text-3xl font-bold text-foreground">24</div>
                <div className="mt-1 text-xs text-success">+3 from last hour</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Critical Cases
                </div>
                <div className="text-3xl font-bold text-destructive">3</div>
                <div className="mt-1 text-xs text-muted-foreground">Immediate attention</div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Avg. Wait Time
                </div>
                <div className="text-3xl font-bold text-foreground">12m</div>
                <div className="mt-1 text-xs text-success">-5m from average</div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-primary/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
