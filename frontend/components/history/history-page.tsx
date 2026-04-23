"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock history data
const mockHistory = [
  {
    id: "TRG-A8F2K",
    patient: "Sarah Johnson",
    age: 62,
    condition: "Chest Pain",
    severity: "Critical" as const,
    score: 1,
    date: "2024-01-15",
    time: "14:32",
    outcome: "Admitted",
  },
  {
    id: "TRG-B3M9P",
    patient: "Michael Chen",
    age: 45,
    condition: "Allergic Reaction",
    severity: "Critical" as const,
    score: 1,
    date: "2024-01-15",
    time: "12:18",
    outcome: "Treated",
  },
  {
    id: "TRG-C7N4Q",
    patient: "Emily Williams",
    age: 28,
    condition: "Abdominal Pain",
    severity: "High" as const,
    score: 2,
    date: "2024-01-15",
    time: "10:45",
    outcome: "Discharged",
  },
  {
    id: "TRG-D2L8R",
    patient: "Robert Davis",
    age: 55,
    condition: "Laceration",
    severity: "Medium" as const,
    score: 3,
    date: "2024-01-14",
    time: "16:22",
    outcome: "Treated",
  },
  {
    id: "TRG-E5K1S",
    patient: "Lisa Thompson",
    age: 34,
    condition: "Migraine",
    severity: "Low" as const,
    score: 4,
    date: "2024-01-14",
    time: "09:15",
    outcome: "Discharged",
  },
  {
    id: "TRG-F9J6T",
    patient: "James Wilson",
    age: 41,
    condition: "Sprained Ankle",
    severity: "Low" as const,
    score: 5,
    date: "2024-01-13",
    time: "11:30",
    outcome: "Discharged",
  },
  {
    id: "TRG-G4H2U",
    patient: "Anna Martinez",
    age: 52,
    condition: "Breathing Difficulty",
    severity: "High" as const,
    score: 2,
    date: "2024-01-13",
    time: "08:45",
    outcome: "Admitted",
  },
  {
    id: "TRG-H8G5V",
    patient: "David Brown",
    age: 67,
    condition: "Stroke Symptoms",
    severity: "Critical" as const,
    score: 1,
    date: "2024-01-12",
    time: "19:20",
    outcome: "Admitted",
  },
];

const severityStyles = {
  Critical: "bg-destructive text-destructive-foreground",
  High: "bg-orange-500 text-white",
  Medium: "bg-warning text-warning-foreground",
  Low: "bg-success text-success-foreground",
};

const outcomeStyles = {
  Admitted: "bg-primary/10 text-primary",
  Treated: "bg-success/10 text-success",
  Discharged: "bg-muted text-muted-foreground",
};

export function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [records, setRecords] = useState(mockHistory);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${API_BASE}/api/history`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setRecords(json.data.map((h: any) => ({
              id: h.id,
              patient: h.patient || h.name || "Unknown",
              age: h.age || 0,
              condition: h.condition || "Unknown",
              severity: h.severity as "Critical" | "High" | "Medium" | "Low",
              score: h.score || h.triageScore || 5,
              date: h.date || "",
              time: h.time || "",
              outcome: h.outcome || "Waiting",
            })));
          }
        }
      } catch (_) {
        // keep mock data if backend offline
      }
    }
    fetchHistory();
  }, []);

  // Filter records
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" ||
      record.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Emergency History
              </h1>
              <p className="text-muted-foreground">
                View and search past emergency triage records
              </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, ID, or condition..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <Select
                    value={severityFilter}
                    onValueChange={(value) => {
                      setSeverityFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Past Emergencies
                  <Badge variant="secondary" className="ml-2">
                    {filteredRecords.length} records
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {paginatedRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">No records found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {paginatedRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {record.patient}
                            </span>
                            <Badge variant="outline" className="font-mono text-xs">
                              {record.id}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {record.age} years old • {record.condition}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={severityStyles[record.severity]}>
                            {record.severity}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">
                            Score: {record.score}/5
                          </span>
                          <Badge
                            variant="secondary"
                            className={outcomeStyles[record.outcome as keyof typeof outcomeStyles]}
                          >
                            {record.outcome}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {record.date} {record.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
