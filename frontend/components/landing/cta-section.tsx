"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl md:px-12 md:py-24">
          {/* Decorative elements */}
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <h2 className="text-pretty text-3xl font-bold tracking-tight md:text-5xl">
              Ready to Modernize Your Emergency Triage?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
              Join leading healthcare providers using TriageAI to optimize response times and improve patient outcomes through multimodal artificial intelligence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild className="min-w-[200px] text-primary">
                <Link href="/emergency">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="min-w-[200px] bg-transparent border-white/30 hover:bg-white/10 text-white">
                <Link href="/contact">
                  Schedule Demo
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4" />
                <span>Save Lives</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
