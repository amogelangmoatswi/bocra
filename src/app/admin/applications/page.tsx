"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { updateApplicationStatus } from "@/app/admin/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, CheckCircle2, Clock, AlertCircle, XCircle, Search,
  ChevronDown, RefreshCw,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  expired: { label: "Expired", color: "bg-slate-100 text-slate-500", icon: Clock },
};

const LICENCE_LABELS: Record<string, string> = {
  nfp_individual: "NFP (Individual)",
  nfp_class: "NFP (Class)",
  ecs_individual: "ECS (Individual)",
  ecs_class: "ECS (Class)",
  spectrum: "Spectrum",
  type_approval: "Type Approval",
  postal: "Postal Operator",
  courier: "Courier Service",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("licence_applications")
        .select("*, profiles(email, full_name)")
        .order("created_at", { ascending: false });
      if (data) setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const result = await updateApplicationStatus(id, newStatus);
    if (result.success) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
    setUpdatingId(null);
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(search.toLowerCase()) ||
      app.reference_number.toLowerCase().includes(search.toLowerCase()) ||
      (app.profiles?.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    under_review: applications.filter((a) => a.status === "under_review").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Licence Applications</h1>
          <p className="text-muted-foreground text-sm">Review and manage incoming licence applications.</p>
        </div>
        <Button variant="outline" onClick={fetchApplications} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: "all", label: "Total", color: "text-foreground" },
          { key: "submitted", label: "Submitted", color: "text-blue-600" },
          { key: "under_review", label: "Under Review", color: "text-yellow-600" },
          { key: "approved", label: "Approved", color: "text-green-600" },
          { key: "rejected", label: "Rejected", color: "text-red-600" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === item.key
                ? "border-bocra-blue bg-bocra-blue/5 shadow-sm"
                : "border-border/50 hover:border-bocra-blue/30"
            }`}
          >
            <div className={`text-2xl font-bold ${item.color}`}>
              {counts[item.key as keyof typeof counts] ?? 0}
            </div>
            <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by company, reference, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading applications...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-lg mb-2">No Applications Found</h3>
          <p className="text-muted-foreground text-sm">No applications match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
            const StatusIcon = config.icon;
            const isUpdating = updatingId === app.id;

            return (
              <Card key={app.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Application Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">{app.reference_number}</Badge>
                        <Badge className={`${config.color} border-none text-xs`}>
                          <StatusIcon className="w-3 h-3 mr-1" /> {config.label}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg truncate">{app.company_name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span>{LICENCE_LABELS[app.licence_type] || app.licence_type}</span>
                        <span>•</span>
                        <span>{app.profiles?.full_name || app.profiles?.email || "Unknown"}</span>
                        <span>•</span>
                        <span>{new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>

                    {/* Right: Status Change */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={app.status}
                        onValueChange={(v) => handleStatusChange(app.id, v)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[160px] h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
