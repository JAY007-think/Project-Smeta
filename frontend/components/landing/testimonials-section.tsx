"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The speed at which TriageAI identifies critical patients is revolutionary. We've seen a 40% reduction in response times for life-threatening cases.",
    author: "Dr. James Miller",
    role: "Head of ER, St. Jude Hospital",
    avatar: "JM"
  },
  {
    quote: "Integrating voice and image analysis into the triage process has significantly improved our diagnostic accuracy and documentation efficiency.",
    author: "Sarah Thompson",
    role: "EMS Director, Metro Health",
    avatar: "ST"
  },
  {
    quote: "As an admin, the analytics provided by TriageAI give me a clear view of our hospital load and personnel performance in real-time.",
    author: "Robert Garcia",
    role: "Hospital Administrator",
    avatar: "RG"
  }
];

export function TestimonialsSection() {
  return (
    <section className="bg-background py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Trusted by Medical Professionals
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            See how TriageAI is helping hospitals and emergency responders save lives and optimize workflows.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex gap-1 mb-4 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-foreground mb-6">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
