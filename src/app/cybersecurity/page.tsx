"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, ShieldAlert, FileWarning, Search, Activity, BookOpen, ExternalLink, ArrowRight, ChevronRight, FileText, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination, usePagination } from "@/components/pagination";

export default function CybersecurityPage() {
  const { data: session } = useSession();
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("cyber_alerts")
          .select("*")
          .eq("status", "published")
          .order("date_issued", { ascending: false });
          
        if (data && data.length > 0) {
          const formatted = data.map((item) => {
            let color = "bg-blue-500";
            if (item.severity === "critical") color = "bg-purple-600";
            else if (item.severity === "high") color = "bg-red-500";
            else if (item.severity === "medium") color = "bg-orange-500";
            else if (item.severity === "low") color = "bg-green-500";

            return {
              id: `ADV-${item.id.toString().slice(0, 8).toUpperCase()}`,
              date: new Date(item.date_issued).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              title: item.title,
              severity: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
              color: color,
            };
          });
          setAdvisories(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch advisories", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvisories();
  }, []);

  return (
    <div className="pb-24">
      {/* Header section with warning tape effect */}
      <div className="bg-slate-900 border-b-4 border-bocra-red pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden">
        {/* Abstract cyber background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-5 bg-cover mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-bold mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Botswana Computer Incident Response Team
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6">
            Cybersecurity <span className="text-bocra-yellow">Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Protecting Botswana's national communications infrastructure. Responding to cyber threats, issuing advisories, and promoting digital safety.
          </p>
          {session?.user ? (
            <Button className="bg-white text-bocra-navy hover:bg-slate-100 font-bold px-6 py-6 h-auto text-base">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report a Cyber Incident
            </Button>
          ) : (
            <Link href="/login?callbackUrl=/cybersecurity">
              <Button className="bg-white text-bocra-navy hover:bg-slate-100 font-bold px-6 py-6 h-auto text-base shadow-lg">
                <Lock className="w-5 h-5 mr-2" />
                Log in to Report Incident
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-border/50 animate-fade-in-up delay-100">
              <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-bocra-blue" />
                    <CardTitle>Recent Threat Advisories</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-bocra-blue">
                    View Archive <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading advisories...</div>
                ) : advisories.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="font-bold text-lg mb-2">No Advisories Posted</h3>
                    <p className="text-sm text-muted-foreground">No cybersecurity advisories have been issued yet.</p>
                  </div>
                ) : (
                <>
                <div className="divide-y divide-border/50">
                  {advisories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((adv) => (
                    <div key={adv.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-2 sm:flex-col sm:items-start sm:gap-1">
                          <span className="text-sm font-medium text-muted-foreground">{adv.date}</span>
                          <Badge variant="outline" className="font-mono text-xs">{adv.id}</Badge>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1 group-hover:text-bocra-blue transition-colors">{adv.title}</h4>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${adv.color}`}></span>
                          <span className="text-sm font-semibold">{adv.severity}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(advisories.length / PAGE_SIZE)}
                  onPageChange={setCurrentPage}
                />
                </>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up delay-200">
              <Card className="group hover:border-bocra-blue/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-bocra-blue transition-colors">National Strategy</h3>
                  <p className="text-sm text-muted-foreground mb-4">Read Botswana's comprehensive National Cybersecurity Strategy and implementation goals.</p>
                  <Button variant="link" className="p-0 h-auto text-bocra-blue">Download PDF <ExternalLink className="w-3 h-3 ml-1" /></Button>
                </CardContent>
              </Card>
              
              <Card className="group hover:border-bocra-green/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-bocra-green/10 flex items-center justify-center mb-4">
                    <ShieldAlert className="w-6 h-6 text-bocra-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-bocra-green transition-colors">Take-Down Notices</h3>
                  <p className="text-sm text-muted-foreground mb-4">Under ECTA 2014, BOCRA administers notices for unlawful online content removal.</p>
                  {session?.user ? (
                    <Button variant="link" className="p-0 h-auto text-bocra-green">Submit Request <ChevronRight className="w-3 h-3 ml-1" /></Button>
                  ) : (
                    <Link href="/login?callbackUrl=/cybersecurity">
                      <Button variant="link" className="p-0 h-auto text-bocra-green">Log in to Submit <Lock className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6 animate-fade-in-up delay-300">
            <Card className="bg-slate-900 text-white border-slate-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
              <CardContent className="p-6">
                <Lock className="w-10 h-10 text-bocra-yellow mb-4" />
                <h3 className="text-xl font-bold mb-2">Emergency Contact</h3>
                <p className="text-slate-400 text-sm mb-6">For critical infrastructure incidents requiring immediate bwCIRT assistance.</p>
                <div className="space-y-3">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Hotline (24/7)</div>
                    <div className="font-mono text-lg font-bold text-red-400">+267 368-2000</div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Incident Email</div>
                    <div className="text-sm font-semibold text-bocra-yellow">cirt@bocra.org.bw</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileWarning className="w-5 h-5 text-muted-foreground" />
                  Resources & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    "Guideline for Secure Teleworking",
                    "Ransomware Prevention Checklist",
                    "Protecting Personal Data (BDPA 2024)",
                    "Child Online Protection (COP) Guide"
                  ].map((doc, i) => (
                    <li key={i}>
                      <a href="#" className="flex items-start gap-3 group">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-bocra-blue/10 transition-colors">
                          <FileText className="w-4 h-4 text-muted-foreground group-hover:text-bocra-blue" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-bocra-blue transition-colors line-clamp-2">{doc}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-6">View All Resources</Button>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
