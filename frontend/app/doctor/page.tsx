import { Metadata } from "next";
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard";

export const metadata: Metadata = {
  title: "Doctor Dashboard | Smart Triage AI",
  description: "Real-time patient queue and triage management for medical professionals",
};

export default function DoctorPage() {
  return <DoctorDashboard />;
}
