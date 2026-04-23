"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  AlertTriangle,
  Clock,
  Activity,
  Search,
  RefreshCw,
  Eye,
  Bell,
} from "lucide-react";
import { PatientQueue } from "./patient-queue";
import { PatientDetailModal } from "./patient-detail-modal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Mock data fallback
const mockPatients = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 62,
    gender: "Female",
    condition: "Chest Pain",
    severity: "Critical" as const,
    score: 1,
    time: "2 min ago",
    status: "Waiting" as const,
    symptoms: ["Severe chest pain", "Shortness of breath", "Cold sweat"],
    vitals: { bp: "180/110", hr: 98, temp: "98.6°F", spo2: "94%" },
  },
  {
    id: "P002",
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    condition: "Severe Allergic Reaction",
    severity: "Critical" as const,
    score: 1,
    time: "5 min ago",
    status: "In Treatment" as const,
    symptoms: ["Facial swelling", "Difficulty breathing", "Hives"],
    vitals: { bp: "100/70", hr: 110, temp: "99.1°F", spo2: "92%" },
  },
  {
    id: "P003",
    name: "Emily Williams",
    age: 28,
    gender: "Female",
    condition: "Abdominal Pain",
    severity: "High" as const,
    score: 2,
    time: "8 min ago",
    status: "Waiting" as const,
    symptoms: ["Sharp lower abdominal pain", "Nausea", "Fever"],
    vitals: { bp: "130/85", hr: 88, temp: "100.4°F", spo2: "98%" },
  },
];

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  score: number;
  time: string;
  status: "Waiting" | "In Treatment" | "Completed";
  symptoms: string[];
  vitals: { bp: string; hr: number; temp: string; spo2: string };
};

function mapApiPatient(p: any): Patient {
  const now = new Date();
  const created = p.timestamp ? new Date(p.timestamp) : now;
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const time = diffMin < 1 ? "Just now" : `${diffMin} min ago`;

  return {
    id: p.id,
    name: p.name || "Unknown",
    age: p.age || 0,
    gender: p.gender || "Unknown",
    condition: p.condition || "Unknown",
    severity: (p.severity as Patient["severity"]) || "Low",
    score: p.triageScore || 5,
    time,
    status: (p.status === "Discharged" ? "Completed" : p.status) as Patient["status"] || "Waiting",
    symptoms: Array.isArray(p.symptoms) ? p.symptoms : [],
    vitals: p.vitals || { bp: "N/A", hr: 0, temp: "N/A", spo2: "N/A" },
  };
}

export function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/patients`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPatients(json.data.map(mapApiPatient));
          setBackendOnline(true);
        } else {
          setBackendOnline(true); // online but no patients yet — keep mock
        }
      }
    } catch (_) {
      // backend not reachable — keep mock data
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, [fetchPatients]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPatients();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Update local state immediately for responsiveness
        setPatients(prev => prev.map(p => p.id === id ? { ...p, status: (newStatus === 'Completed' || newStatus === 'Treated' ? 'Completed' : newStatus) as Patient['status'] } : p));
        // Also refresh from backend
        fetchPatients();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const criticalCount = patients.filter((p) => p.severity === "Critical").length;
  const highCount = patients.filter((p) => p.severity === "High").length;
  const avgWaitTime = "12 min";

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 p-4 md:p-6 text-foreground">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Doctor <span className="text-primary italic">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time patient queue management.
                {backendOnline && (
                  <span className="ml-3 inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    System Live
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="glass border-border/50"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Live Sync
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="glass shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Queue Size</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5 shadow-sm shadow-destructive/5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-destructive/70">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-orange-500/5 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
                  <Activity className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-600/70">Urgent</p>
                  <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-success/70">Avg. Wait</p>
                  <p className="text-2xl font-bold">{avgWaitTime}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Queue */}
          <Card className="border-none shadow-xl shadow-black/5 overflow-hidden">
            <div className="flex flex-col gap-4 bg-muted/20 md:flex-row md:items-center md:justify-between p-6 border-b border-border">
              <CardTitle className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live Patient Stream
              </CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by name, ID or condition..."
                  className="pl-9 bg-background/50 border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardContent className="p-0">
              <PatientQueue
                patients={filteredPatients}
                onViewPatient={setSelectedPatient}
                onUpdateStatus={handleUpdateStatus}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium">Severity Levels:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <span>Critical (1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span>High (2)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-warning" />
              <span>Medium (3)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span>Low (4-5)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
