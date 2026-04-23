"use client";

import { motion } from "framer-motion";
import { FileText, Cpu, BarChart, Stethoscope } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: FileText,
    title: "Patient Submits Emergency",
    description:
      "Patient enters symptoms via text, voice, or uploads injury images through our intuitive interface.",
  },
  {
    step: 2,
    icon: Cpu,
    title: "AI Analyzes Data",
    description:
      "Our multimodal AI processes all inputs using NLP and computer vision to understand the condition.",
  },
  {
    step: 3,
    icon: BarChart,
    title: "Generate Triage Score",
    description:
      "AI calculates severity score (1-5) with confidence percentage and recommended actions.",
  },
  {
    step: 4,
    icon: Stethoscope,
    title: "Doctor Gets Alert",
    description:
      "Medical staff receives real-time alerts for critical cases with full patient assessment.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-border py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-pretty text-3xl font-bold tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From patient input to doctor alert in under 30 seconds
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Connection line - desktop */}
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-64px)] w-0.5 -translate-x-1/2 bg-border md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col items-center gap-4 md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 rounded-xl border border-border bg-card p-6 shadow-sm ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 ${
                      index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                    }`}
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
