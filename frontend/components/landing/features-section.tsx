"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  ImageIcon,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Severity Detection",
    description:
      "Advanced machine learning algorithms analyze symptoms to accurately predict severity levels in seconds.",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description:
      "Patients can describe symptoms verbally. Our NLP engine processes speech for quick assessment.",
  },
  {
    icon: ImageIcon,
    title: "Image Analysis",
    description:
      "Upload injury photos for computer vision analysis. AI identifies conditions and severity instantly.",
  },
  {
    icon: Users,
    title: "Smart Queue System",
    description:
      "Automatic patient prioritization based on triage scores. Critical cases are flagged immediately.",
  },
  {
    icon: Bell,
    title: "Critical Alerts",
    description:
      "Real-time notifications for doctors when critical patients arrive. Never miss an emergency.",
  },
  {
    icon: BarChart3,
    title: "Doctor Dashboard",
    description:
      "Comprehensive dashboard for medical staff with patient details, history, and recommendations.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-pretty text-3xl font-bold tracking-tight md:text-4xl">
            Powerful Features for Modern Healthcare
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our multimodal AI system combines cutting-edge technology to deliver 
            fast, accurate emergency triage assessments.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
