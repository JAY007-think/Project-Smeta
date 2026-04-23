"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
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
  vitals: {
    bp: string;
    hr: number;
    temp: string;
    spo2: string;
  };
}

interface PatientQueueProps {
  patients: Patient[];
  onViewPatient: (patient: Patient) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const severityStyles = {
  Critical: {
    badge: "bg-destructive text-destructive-foreground",
    row: "border-l-4 border-l-destructive bg-destructive/5",
  },
  High: {
    badge: "bg-orange-500 text-white",
    row: "border-l-4 border-l-orange-500 bg-orange-500/5",
  },
  Medium: {
    badge: "bg-amber-500 text-white",
    row: "border-l-4 border-l-amber-500 bg-amber-500/5",
  },
  Low: {
    badge: "bg-success text-success-foreground",
    row: "border-l-4 border-l-success",
  },
};

const statusStyles = {
  Waiting: "bg-muted text-muted-foreground",
  Processing: "bg-primary/10 text-primary",
  Completed: "bg-success/10 text-success",
  Treated: "bg-success/10 text-success",
  Rejected: "bg-destructive/10 text-destructive",
};

export function PatientQueue({ patients, onViewPatient, onUpdateStatus }: PatientQueueProps) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Eye className="h-8 w-8 text-muted-foreground opacity-20" />
        </div>
        <p className="text-lg font-medium text-foreground">No patients in queue</p>
        <p className="text-sm text-muted-foreground">All clear for now.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-6 py-4 font-semibold">Patient</th>
            <th className="px-6 py-4 font-semibold">Diagnosis (AI)</th>
            <th className="px-6 py-4 font-semibold text-center">Severity</th>
            <th className="px-6 py-4 font-semibold text-center">Triage</th>
            <th className="px-6 py-4 font-semibold">Time</th>
            <th className="px-6 py-4 font-semibold text-center">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients
            .sort((a, b) => a.score - b.score)
            .map((patient) => {
            const styles = severityStyles[patient.severity as keyof typeof severityStyles] || severityStyles.Low;
            return (
              <tr
                key={patient.id}
                className={cn(
                  "border-b border-border transition-all hover:bg-muted/30",
                  styles.row
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                      {patient.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.id} • {patient.age}y • {patient.gender}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground font-medium">{patient.condition}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge className={cn("rounded-full px-3", styles.badge)}>{patient.severity}</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border font-bold text-foreground">
                      {patient.score}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{patient.time}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="secondary" className={cn("rounded-full", statusStyles[patient.status as keyof typeof statusStyles])}>
                    {patient.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => onViewPatient(patient)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {patient.status === 'Waiting' ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="rounded-full"
                        onClick={() => onUpdateStatus(patient.id, 'Processing')}
                      >
                        Accept
                      </Button>
                    ) : patient.status === 'Processing' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full border-success text-success hover:bg-success/10"
                        onClick={() => onUpdateStatus(patient.id, 'Treated')}
                      >
                        Resolve
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="rounded-full">
                        Done
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
