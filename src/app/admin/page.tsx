import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, Users, AlertTriangle, ShieldCheck, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Admin Dashboard | BOCRA",
  description: "BOCRA content management system",
};

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch live counts
  const [newsRes, consultRes, alertsRes] = await Promise.all([
    supabase.from("news_articles").select("id", { count: "exact", head: true }),
    supabase.from("public_consultations").select("id", { count: "exact", head: true }),
    supabase.from("cyber_alerts").select("id", { count: "exact", head: true }),
  ]);

  const newsCount = newsRes.count ?? 0;
  const consultCount = consultRes.count ?? 0;
  const alertsCount = alertsRes.count ?? 0;

  // Fetch critical alert count
  const { count: criticalCount } = await supabase
    .from("cyber_alerts")
    .select("id", { count: "exact", head: true })
    .eq("severity", "critical")
    .eq("status", "published");

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, Administrator</h1>
        <p className="text-muted-foreground">Manage the public-facing content across the BOCRA regulatory website.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-bocra-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Published on homepage
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Consultations</CardTitle>
            <Users className="h-4 w-4 text-bocra-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active consultation drafts
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Cyber Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertsCount}</div>
            <p className="text-xs text-red-500 flex items-center mt-1">
              {(criticalCount ?? 0) > 0 && (
                <><ArrowUpRight className="w-3 h-3 mr-1" /> {criticalCount} Critical</>
              )}
              {(criticalCount ?? 0) === 0 && (
                <span className="text-muted-foreground">No critical alerts</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">System Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              All services operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="hover:border-bocra-blue/50 transition-colors shadow-sm group">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-bocra-blue/10 flex items-center justify-center mb-2 group-hover:bg-bocra-blue group-hover:text-white transition-colors">
              <Newspaper className="w-6 h-6 text-bocra-blue group-hover:text-white" />
            </div>
            <CardTitle>News & Advisories</CardTitle>
            <CardDescription>Publish press releases or general public advisories shown on the homepage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/news">
              <Button variant="outline" className="w-full justify-between group-hover:border-bocra-blue">
                Manage News <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-bocra-yellow/50 transition-colors shadow-sm group">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-bocra-yellow/10 flex items-center justify-center mb-2 group-hover:bg-bocra-yellow group-hover:text-white transition-colors">
              <Users className="w-6 h-6 text-bocra-yellow group-hover:text-white" />
            </div>
            <CardTitle>Public Consultations</CardTitle>
            <CardDescription>Open new regulation drafts for public comment and set deadlines.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/consultations">
              <Button variant="outline" className="w-full justify-between group-hover:border-bocra-yellow">
                Manage Consultations <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-red-500/50 transition-colors shadow-sm group">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-500 group-hover:text-white" />
            </div>
            <CardTitle>Cybersecurity Alerts</CardTitle>
            <CardDescription>Issue urgent national vulnerability warnings to the Cybersecurity Hub.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/cybersecurity">
              <Button variant="outline" className="w-full justify-between group-hover:border-red-500">
                Manage Alerts <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
