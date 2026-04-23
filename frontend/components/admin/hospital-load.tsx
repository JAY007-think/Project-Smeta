"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

const hospitals = [
  { name: "Central General", load: 85, capacity: 200, status: "Critical" },
  { name: "Westside Medical", load: 45, capacity: 150, status: "Stable" },
  { name: "City Children's", load: 60, capacity: 100, status: "Moderate" },
  { name: "St. Mary's", load: 92, capacity: 180, status: "Critical" },
];

export function HospitalLoad() {
  return (
    <div className="space-y-6">
      {hospitals.map((h) => (
        <div key={h.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{h.name}</span>
            </div>
            <Badge 
              variant="outline" 
              className={
                h.status === "Critical" 
                  ? "border-destructive text-destructive" 
                  : h.status === "Moderate" 
                    ? "border-warning text-warning" 
                    : "border-success text-success"
              }
            >
              {h.status}
            </Badge>
          </div>
          <Progress value={h.load} className="h-2" />
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
            <span>{h.load}% Capacity</span>
            <span>{Math.round((h.load / 100) * h.capacity)} / {h.capacity} Beds</span>
          </div>
        </div>
      ))}
    </div>
  );
}
