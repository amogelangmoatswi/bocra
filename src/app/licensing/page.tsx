"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileText, CheckCircle2, Monitor, Radio, Wifi, Smartphone, Mail, Globe, Clock, FileSearch, Activity, Shield, Settings, Sparkles, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Pagination } from "@/components/pagination";

const ICON_MAP: Record<string, any> = {
  FileText, Monitor, Radio, Wifi, Smartphone, Mail, Globe, Activity, Shield, Settings,
};

export default function LicensingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [licences, setLicences] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const fetchLicences = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("licence_types")
          .select("*")
          .order("display_order");
        if (data && data.length > 0) {
          const mapped = data.map((l: any) => ({
            id: l.id,
            title: l.title,
            category: l.category,
            description: l.description,
            examples: l.examples || "",
            icon: ICON_MAP[l.icon_name] || FileText,
          }));
          setLicences(mapped);
          const cats = ["All", ...Array.from(new Set(data.map((l: any) => l.category)))] as string[];
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch licence types", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLicences();
  }, []);

  const filteredLicences = licences.filter((licence) => {
    const matchesSearch = licence.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          licence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || licence.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 bg-slate-50/50 dark:bg-background min-h-screen">
      {/* Premium Hero Section */}
      <div className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 px-4 overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 bg-bocra-navy overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-bocra-green/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-bocra-blue/20 rounded-full blur-[150px] mix-blend-screen animate-float"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,_black_50%,_transparent_100%)]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-white/10 text-white/90 border border-white/20 backdrop-blur-md mb-6 px-4 py-1.5 font-medium tracking-wide">
            <Sparkles className="w-4 h-4 mr-2 text-bocra-yellow" /> BOCRA Digital Portal
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Licensing <span className="text-transparent bg-clip-text bg-gradient-to-r from-bocra-green to-bocra-blue-light">Self-Service</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Apply, track, renew, and verify communication licences online through our converged licensing framework.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/licensing/apply">
              <Button size="lg" className="bg-bocra-yellow hover:bg-bocra-yellow/90 text-bocra-navy font-bold w-full sm:w-auto h-14 px-8 text-lg rounded-xl shadow-[0_0_40px_rgba(255,184,28,0.3)] transition-all hover:scale-105">
                Start Application <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/licensing/apply">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto h-14 px-8 text-lg rounded-xl backdrop-blur-sm transition-all">
                Check Status
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Quick Actions (Glassmorphism Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/licensing/apply" className="block group">
            <div className="bg-card/80 backdrop-blur-xl border border-border/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bocra-blue to-bocra-blue-light flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-foreground">Apply Online</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Submit all required documents digitally to skip the physical queues.</p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/licensing/apply" className="block group">
            <div className="bg-card/80 backdrop-blur-xl border border-border/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bocra-yellow to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-bocra-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-foreground">Track Status</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Monitor your application progress in real time via your dashboard.</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-card/80 backdrop-blur-xl border border-border/60 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bocra-green to-green-400 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-foreground">Verify Licence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Public tool to verify the authenticity of issued communication licences.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-6 md:p-10 animate-fade-in-up delay-200">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Licence Catalogue</h2>
              <p className="text-muted-foreground">Find the specific framework required for your communication services.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-bocra-blue transition-colors" />
              </div>
              <Input 
                type="text" 
                placeholder="Search licences by name or keyword..." 
                className="pl-12 h-14 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 text-base transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Premium Segmented Controls (Categories) */}
          <div className="flex overflow-x-auto pb-4 -mx-2 px-2 md:mx-0 md:px-0 gap-3 mb-8 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-bocra-blue text-white shadow-md shadow-bocra-blue/20 scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted/50 animate-pulse border border-border/50"></div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLicences.length > 0 ? (
              <>
              {filteredLicences.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((licence) => {
                const Icon = licence.icon;
                return (
                  <Card key={licence.id} className="group overflow-hidden border-border/60 hover:border-bocra-blue/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,168,157,0.1)] transition-all duration-500 bg-gradient-to-b from-card to-card/50 flex flex-col h-full">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-muted flex items-center justify-center group-hover:bg-bocra-blue group-hover:text-white transition-colors duration-300">
                          <Icon className="w-6 h-6 text-bocra-blue group-hover:text-white" />
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase bg-muted/50 border-transparent text-muted-foreground group-hover:border-bocra-blue/30 group-hover:text-bocra-blue transition-colors">
                          {licence.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-bocra-blue transition-colors line-clamp-2">
                        {licence.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                        {licence.description}
                      </p>
                      
                      {licence.examples && (
                        <div className="bg-bocra-green/5 dark:bg-bocra-green/10 rounded-xl p-4 text-sm mt-auto border border-bocra-green/10">
                          <div className="flex items-start gap-2">
                            <FileSearch className="w-4 h-4 text-bocra-green shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              <strong className="text-bocra-navy dark:text-white block mb-1">Common Examples:</strong>
                              {licence.examples}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    {/* Hover Apply Button Strip */}
                    <div className="h-0 opacity-0 group-hover:h-12 group-hover:opacity-100 bg-bocra-blue text-white flex items-center justify-center font-medium transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => window.location.href='/licensing/apply'}>
                      Apply Now <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
                );
              })}
              <div className="col-span-full pt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredLicences.length / PAGE_SIZE)}
                  onPageChange={setCurrentPage}
                />
              </div>
              </>
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileSearch className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No licences found</h3>
                <p className="text-muted-foreground">Try adjusting your search keywords or category filters.</p>
                <Button variant="outline" className="mt-6" onClick={() => {setSearchTerm(""); setActiveCategory("All");}}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
