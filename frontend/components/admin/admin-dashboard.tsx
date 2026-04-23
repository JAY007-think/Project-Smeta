"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react";
import { SeverityChart } from "./severity-chart";
import { EmergencyTrendChart } from "./emergency-trend-chart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock analytics data
const stats = {
  totalPatients: 156,
  criticalCases: 12,
  avgWaitTime: "14 min",
  resolvedToday: 89,
  aiAccuracy: "94.5%",
  activeStaff: 8,
};

const recentActivity = [
  { id: 1, event: "Critical patient admitted", time: "2 min ago", type: "critical" },
  { id: 2, event: "Patient P-145 discharged", time: "8 min ago", type: "success" },
  { id: 3, event: "New doctor logged in", time: "15 min ago", type: "info" },
  { id: 4, event: "High priority case resolved", time: "22 min ago", type: "warning" },
  { id: 5, event: "System backup completed", time: "1 hour ago", type: "info" },
];

const activityStyles = {
  critical: "border-l-destructive bg-destructive/5",
  success: "border-l-success bg-success/5",
  warning: "border-l-orange-500 bg-orange-500/5",
  info: "border-l-primary bg-primary/5",
};

import { HospitalLoad } from "./hospital-load";

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 text-foreground">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Hospital <span className="text-primary italic">Intelligence</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Macro-view of system performance, doctor activity, and facility loads.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Card className="glass shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Patients</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black">{stats.totalPatients}</p>
                  <Users className="h-5 w-5 text-primary opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive/70 mb-2">Critical</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-destructive">{stats.criticalCases}</p>
                  <AlertTriangle className="h-5 w-5 text-destructive opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Avg Wait</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black">{stats.avgWaitTime}</p>
                  <Clock className="h-5 w-5 text-primary opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Resolved</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black text-success">{stats.resolvedToday}</p>
                  <CheckCircle className="h-5 w-5 text-success opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">AI Precision</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black">{stats.aiAccuracy}</p>
                  <TrendingUp className="h-5 w-5 text-chart-2 opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">On Duty</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-black">{stats.activeStaff}</p>
                  <Activity className="h-5 w-5 text-chart-5 opacity-50 mb-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="mb-10 grid gap-8 lg:grid-cols-2">
            <Card className="border-none shadow-xl shadow-black/5 bg-background/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <SeverityChart />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-black/5 bg-background/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Facility Load Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <HospitalLoad />
              </CardContent>
            </Card>
          </div>

          {/* Activity Logs */}
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-none shadow-xl shadow-black/5 bg-background/50 overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Activity className="h-5 w-5 text-primary" />
                  Real-time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={cn(
                        "flex items-center justify-between p-4 transition-colors hover:bg-muted/30",
                        activity.type === 'critical' ? "bg-destructive/5" : ""
                      )}
                    >
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-2 w-2 rounded-full",
                           activity.type === 'critical' ? "bg-destructive animate-pulse" : 
                           activity.type === 'success' ? "bg-success" : "bg-primary"
                         )} />
                         <span className="text-sm font-medium">{activity.event}</span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-black/5 bg-primary text-primary-foreground relative overflow-hidden">
               <div className="relative z-10 p-8">
                 <h3 className="text-2xl font-bold mb-4">Emergency Alert Protocol</h3>
                 <p className="text-primary-foreground/80 mb-6 font-medium">
                   All critical cases (Triage Score 1) are automatically routed to the nearest trauma center and notify on-duty cardiac teams.
                 </p>
                 <Button variant="secondary" className="w-full text-primary font-bold">
                   Edit Protocols
                 </Button>
               </div>
               <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
