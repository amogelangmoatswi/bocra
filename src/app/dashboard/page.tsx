"use client";

import { useState, useEffect, memo } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, Activity, TrendingUp, Download, Smartphone, Wifi, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
};

// ────────────────────────────────────────────
// Memoised chart sub-components
// Each is wrapped in React.memo so it only
// re-renders when its own props change.
// isAnimationActive={false} removes the
// initial paint delay on every tab switch.
// ────────────────────────────────────────────

const MarketGrowthChart = memo(function MarketGrowthChart({ mobileData, shareData }: { mobileData: any[]; shareData: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 shadow-md border-border/50 h-[450px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-bocra-blue" /> Mobile Subscriptions (Millions)
          </CardTitle>
          <CardDescription>5-year continuous growth trend in Botswana</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mobileData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} dx={-10} domain={[3, 5]} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} contentStyle={TOOLTIP_STYLE} />
              <Bar
                dataKey="subscribers"
                fill="var(--color-bocra-blue)"
                radius={[4, 4, 0, 0]}
                name="Subscribers (M)"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md border-border/50 h-[450px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PieChart className="w-5 h-5 text-bocra-yellow" /> Mobile Market Share
          </CardTitle>
          <CardDescription>By operator (Q2 2024)</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col items-center justify-center">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={shareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {shareData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full mt-4 space-y-2">
            {shareData.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-muted-foreground font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

const QosChart = memo(function QosChart({ qosData }: { qosData: any[] }) {
  return (
    <Card className="shadow-md border-border/50 h-[450px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="w-5 h-5 text-bocra-green" /> National Quality of Service Averages (H1 2024)
        </CardTitle>
        <CardDescription>Call Setup Success Rate vs Drop Call Rate</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={qosData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} domain={[98, 100]} />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
              domain={[0, 2]}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Call Setup Success"
              stroke="var(--color-bocra-green)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-bocra-green)", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Drop Call Rate"
              stroke="var(--color-bocra-yellow)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-bocra-yellow)", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

// ────────────────────────────────────────────
// Main page component
// Uses CSS visibility-based tabs instead of
// conditional rendering so charts are NEVER
// unmounted — eliminating the re-mount cost.
// ────────────────────────────────────────────
export default function DashboardPage() {
  const [period, setPeriod] = useState("2024-q2");
  const [activeTab, setActiveTab] = useState<"market" | "qos">("market");
  const [mobileData, setMobileData] = useState<any[]>([]);
  const [shareData, setShareData] = useState<any[]>([]);
  const [qosData, setQosData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("dashboard_datasets").select("*");
        if (data) {
          for (const ds of data) {
            if (ds.dataset_name === "mobile_subscribers" && Array.isArray(ds.data_json)) setMobileData(ds.data_json);
            if (ds.dataset_name === "market_share" && Array.isArray(ds.data_json)) setShareData(ds.data_json);
            if (ds.dataset_name === "qos_metrics" && Array.isArray(ds.data_json)) setQosData(ds.data_json);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDatasets();
  }, []);

  return (
    <div className="pb-24 bg-slate-50 dark:bg-background min-h-screen">
      {/* Header */}
      <div className="bg-bocra-blue pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-6 font-semibold border-none backdrop-blur-sm">
              Public Data Portal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Regulatory Dashboard
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              Explore interactive data on Botswana's telecommunications sector performance, market share, and quality
              of service metrics.
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white backdrop-blur-sm focus:ring-white/30">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-q2">Q2 2024</SelectItem>
                <SelectItem value="2024-q1">Q1 2024</SelectItem>
                <SelectItem value="2023-q4">Q4 2023</SelectItem>
                <SelectItem value="2023-q3">Q3 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2 h-10 px-4 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-bocra-blue/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-bocra-blue" />
                </div>
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 flex gap-1">
                  <TrendingUp className="w-3 h-3" /> +4.2%
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Mobile Subscriptions
              </h3>
              <div className="text-3xl font-bold text-foreground">4.8M</div>
              <p className="text-xs text-muted-foreground mt-2">185% penetration rate</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-bocra-green/10 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-bocra-green" />
                </div>
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 flex gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Fixed Broadband
              </h3>
              <div className="text-3xl font-bold text-foreground">125K</div>
              <p className="text-xs text-muted-foreground mt-2">Active FTTx connections</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-bocra-yellow/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-bocra-yellow" />
                </div>
                <Badge variant="outline" className="text-bocra-blue bg-bocra-blue/5 border-bocra-blue/20">
                  Target: 99%
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Avg Call Success
              </h3>
              <div className="text-3xl font-bold text-foreground">99.4%</div>
              <p className="text-xs text-muted-foreground mt-2">Across all 3 major MNOs</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <RadioTower className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Spectrum Assignments
              </h3>
              <div className="text-3xl font-bold text-foreground">1,432</div>
              <p className="text-xs text-muted-foreground mt-2">Active frequency licences</p>
            </CardContent>
          </Card>
        </div>

        {/* Custom tab headers — pure CSS switching, no unmounting */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-border/50 shadow-sm p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "market"
                  ? "bg-bocra-blue text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Market &amp; Growth
            </button>
            <button
              onClick={() => setActiveTab("qos")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "qos"
                  ? "bg-bocra-blue text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quality of Service
            </button>
          </div>

          {/*
            Both panels are always in the DOM.
            Only CSS visibility changes — charts are never unmounted.
            This is the key fix for the "slow tab switching" issue.
          */}
          <div className={activeTab === "market" ? "block" : "hidden"}>
            <MarketGrowthChart mobileData={mobileData} shareData={shareData} />
          </div>

          <div className={activeTab === "qos" ? "block" : "hidden"}>
            <QosChart qosData={qosData} />
          </div>
        </div>
      </div>
    </div>
  );
}
