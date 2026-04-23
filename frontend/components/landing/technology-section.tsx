"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const technologies = [
  {
    name: "Natural Language Processing",
    description: "Advanced NLP models understand patient descriptions and extract critical symptoms.",
    tag: "NLP",
  },
  {
    name: "Computer Vision",
    description: "State-of-the-art image analysis identifies injuries, conditions, and severity levels.",
    tag: "CV",
  },
  {
    name: "Multimodal AI",
    description: "Combines text, voice, and image data for comprehensive patient assessment.",
    tag: "AI",
  },
  {
    name: "Real-time Dashboard",
    description: "Live updates and alerts ensure medical staff never miss critical patients.",
    tag: "RT",
  },
];

export function TechnologySection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-pretty text-3xl font-bold tracking-tight md:text-4xl">
                Built on Cutting-Edge Technology
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our platform leverages the latest advances in artificial intelligence 
                to deliver accurate, fast, and reliable emergency triage.
              </p>

              <div className="mt-8 space-y-6">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                      {tech.tag}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Button asChild>
                  <Link href="/emergency">
                    Try TriageAI Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold">AI Analysis Preview</h3>
                  <p className="text-sm text-muted-foreground">Real-time processing visualization</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Text Analysis", value: 92, color: "bg-primary" },
                    { label: "Voice Processing", value: 88, color: "bg-chart-2" },
                    { label: "Image Recognition", value: 95, color: "bg-chart-4" },
                    { label: "Severity Calculation", value: 97, color: "bg-chart-3" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg border border-success/30 bg-success/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
                      <span className="text-lg font-bold text-success-foreground">4</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Triage Score: Medium</div>
                      <div className="text-xs text-muted-foreground">Confidence: 94.2%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
