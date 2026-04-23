import { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Smart Triage AI",
  description: "Analytics and system management for emergency triage",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
