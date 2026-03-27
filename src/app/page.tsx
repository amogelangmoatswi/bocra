"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lock,
  FileText,
  MessageSquare,
  Globe,
  Radio,
  Wifi,
  Mail,
  Smartphone,
  ChevronRight,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { createClient } from "@/lib/supabase";
import { AboutHeroGradient } from "@/components/ui/about-hero-gradient";

const ICON_MAP: Record<string, any> = {
  FileText, Globe, MessageSquare, Lock, Radio, BarChart3, Users,
};

/* ── Sector Colours ──────────────────────────────────── */
const SECTORS = [
  { label: "Telecoms",      color: "bg-bocra-blue",   textColor: "text-bocra-blue",   icon: Smartphone },
  { label: "Broadcasting",  color: "bg-bocra-yellow", textColor: "text-bocra-yellow", icon: Radio },
  { label: "Internet",      color: "bg-bocra-green",  textColor: "text-bocra-green",  icon: Wifi },
  { label: "Postal",        color: "bg-bocra-red",    textColor: "text-bocra-red",    icon: Mail },
];

/* ── Services ────────────────────────────────────────── */
const SERVICES = [
  {
    title: "Licensing Portal",
    description: "Apply for or renew your telecommunications or broadcasting licence online.",
    icon: FileText,
    href: "/licensing",
    sector: "telecoms",
    iconBg: "bg-bocra-blue/10",
    iconColor: "text-bocra-blue",
    hoverBorder: "hover:border-bocra-blue/30",
    hoverText: "group-hover:text-bocra-blue",
  },
  {
    title: ".BW Domains",
    description: "Register and manage Botswana's official country-code top-level domain.",
    icon: Globe,
    href: "/domains",
    sector: "internet",
    iconBg: "bg-bocra-green/10",
    iconColor: "text-bocra-green",
    hoverBorder: "hover:border-bocra-green/30",
    hoverText: "group-hover:text-bocra-green",
  },
  {
    title: "Consumer Complaints",
    description: "File a complaint against a service provider or track an existing case.",
    icon: MessageSquare,
    href: "/complaints",
    sector: "broadcasting",
    iconBg: "bg-bocra-yellow/10",
    iconColor: "text-bocra-yellow",
    hoverBorder: "hover:border-bocra-yellow/30",
    hoverText: "group-hover:text-bocra-yellow",
  },
  {
    title: "Cybersecurity (bwCIRT)",
    description: "Report cyber incidents and access national cybersecurity advisories.",
    icon: Lock,
    href: "/cybersecurity",
    sector: "postal",
    iconBg: "bg-bocra-red/10",
    iconColor: "text-bocra-red",
    hoverBorder: "hover:border-bocra-red/30",
    hoverText: "group-hover:text-bocra-red",
  },
  {
    title: "Radio Spectrum",
    description: "Apply for frequency assignments and manage your spectrum usage.",
    icon: Radio,
    href: "/services",
    sector: "broadcasting",
    iconBg: "bg-bocra-yellow/10",
    iconColor: "text-bocra-yellow",
    hoverBorder: "hover:border-bocra-yellow/30",
    hoverText: "group-hover:text-bocra-yellow",
  },
  {
    title: "Telecoms Statistics",
    description: "View real-time dashboards on sector performance and market share.",
    icon: BarChart3,
    href: "/dashboard",
    sector: "telecoms",
    iconBg: "bg-bocra-blue/10",
    iconColor: "text-bocra-blue",
    hoverBorder: "hover:border-bocra-blue/30",
    hoverText: "group-hover:text-bocra-blue",
  },
];

export default function Home() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_stats")
          .select("*")
          .order("display_order");
        if (data && data.length > 0) {
          setStatsData(data.map((s: any) => ({
            label: s.label,
            value: s.value,
            icon: ICON_MAP[s.icon_name] || FileText,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();

    const fetchNews = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("news_articles")
          .select("*")
          .eq("status", "published")
          .order("publish_date", { ascending: false })
          .limit(3);
        if (data && data.length > 0) {
          setNewsData(data.map((item) => ({
            date: item.publish_date,
            title: item.title,
            category: "News",
            id: item.id,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };
    fetchNews();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted, newsData, statsData]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">

      {/* ════════════════════════════════════════════════════════
          HERO  ─  Deep blue with four-sector colour strip
         ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-36 lg:pt-32 lg:pb-44 flex items-center justify-center min-h-[600px] lg:min-h-[800px]">
        {/* ShaderGradient Background Layer */}
        <div className="absolute inset-0 -z-30">
          <AboutHeroGradient />
        </div>

        {/* Foundation & Overlays */}
        <div className="absolute inset-0 bg-bocra-navy/40 -z-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-bocra-blue -z-40"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-3xl animate-fade-in-up">
            {/* Sector pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {SECTORS.map((s) => (
                <div key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white/90 backdrop-blur-sm border border-white/10`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                  {s.label}
                </div>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              {t("hero_title").includes("Botswana") ? (
                <>
                  {t("hero_title").split("Botswana")[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-bocra-yellow via-bocra-green to-white">
                    Botswana
                  </span>
                  {t("hero_title").split("Botswana")[1]}
                </>
              ) : (
                t("hero_title")
              )}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl">
              Promoting competition, innovation, consumer protection, and universal
              access across telecommunications, broadcasting, postal, and ICT sectors.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/licensing">
                <Button size="lg" className="bg-bocra-yellow hover:bg-bocra-yellow-light text-bocra-navy font-semibold text-base h-12 px-8 shadow-xl shadow-bocra-yellow/20">
                  {t("cta_licensing")}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/complaints">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-medium text-base h-12 px-8 backdrop-blur-sm">
                  File a Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats overlay */}
      <div className="relative -mt-16 z-30 hidden lg:block mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-4">
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              const sectorColor = [
                "border-l-bocra-blue",
                "border-l-bocra-yellow",
                "border-l-bocra-green",
                "border-l-bocra-red",
              ][i % 4];
              const sectorTextColor = [
                "text-bocra-blue",
                "text-bocra-yellow",
                "text-bocra-green",
                "text-bocra-red",
              ][i % 4];
              return (
                <Card key={i} className={`bg-white dark:bg-card shadow-xl reveal delay-100 border-l-4 ${sectorColor}`}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-bocra-blue/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-6 h-6 ${sectorTextColor}`} />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${sectorTextColor}`}>{stat.value}</div>
                      <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICES  ─  Colour-coded cards
         ════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-bocra-blue dark:text-white">
              Digital Regulatory Services
            </h2>
            <p className="text-muted-foreground text-lg">
              Access all BOCRA services through our integrated digital platform. Faster, transparent, and user-centric.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <Link key={i} href={service.href} className="group outline-none">
                  <Card className={`h-full border-border/50 shadow-sm hover:shadow-xl ${service.hoverBorder} transition-all duration-300 reveal`}>
                    <CardContent className="p-8">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 ${service.iconBg}`}>
                        <Icon className={`w-7 h-7 ${service.iconColor}`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${service.hoverText} transition-colors`}>
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <div className={`flex items-center text-sm font-semibold ${service.iconColor} opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-300`}>
                        Access Service <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CONSUMER PROTECTION
         ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-muted/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bocra-green/10 text-bocra-green text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" /> Consumer Protection
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-foreground">
                Empowering and Protecting Botswana&apos;s Consumers
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We are committed to ensuring you receive safe, reliable, and high-quality communications, postal, and broadcasting services. If a service provider falls short of their obligations, we&apos;re here to help.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  { text: "Quality of Service monitoring", color: "bg-bocra-blue" },
                  { text: "Transparent pricing oversight", color: "bg-bocra-yellow" },
                  { text: "Dispute resolution & investigations", color: "bg-bocra-green" },
                  { text: "Data protection compliance", color: "bg-bocra-red" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`}></div>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>

              <Link href="/complaints">
                <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white shadow-lg">
                  Learn About Your Rights
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative reveal delay-200">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative p-8 flex flex-col justify-between border border-border/50 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-muted/20 dark:via-muted/10 dark:to-muted/5">
                {/* Sector-coloured floating icons */}
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-bocra-blue shadow-lg flex items-center justify-center animate-float delay-100">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-bocra-yellow shadow-lg flex items-center justify-center animate-float delay-300">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-br from-bocra-blue/20 via-bocra-green/20 to-bocra-yellow/20 animate-pulse-glow flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-bocra-navy shadow-xl flex items-center justify-center z-10">
                    <span className="font-bold text-xl text-bocra-blue">100%</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="w-14 h-14 rounded-2xl bg-bocra-green shadow-lg flex items-center justify-center animate-float delay-500">
                    <Wifi className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-bocra-red shadow-lg flex items-center justify-center animate-float delay-200">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          NEWS & UPDATES
         ════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 dark:bg-background border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-bocra-blue dark:text-white">
                Latest Announcements
              </h2>
              <p className="text-muted-foreground">Stay updated with regulatory news and consultations.</p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="gap-2">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsData.map((item, i) => {
              const borderColor = [
                "border-t-bocra-blue",
                "border-t-bocra-yellow",
                "border-t-bocra-green",
              ][i % 3];
              return (
                <Card key={i} className={`group border-border/50 hover:shadow-lg transition-all duration-300 reveal border-t-4 ${borderColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-bocra-blue">
                        {item.category}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-4 group-hover:text-bocra-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <Link href="#" className="inline-flex items-center text-sm font-medium text-bocra-blue hover:text-bocra-blue-light">
                      Read more <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA  ─  Sector colour gradient
         ════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden reveal">
            {/* Gradient strip on top */}
            <div className="h-1.5 flex">
              <div className="flex-1 bg-bocra-blue"></div>
              <div className="flex-1 bg-bocra-green"></div>
              <div className="flex-1 bg-bocra-red"></div>
              <div className="flex-1 bg-bocra-yellow"></div>
            </div>
            <div className="bg-bocra-blue p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-bocra-green rounded-full blur-[80px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-bocra-yellow rounded-full blur-[80px] opacity-20 translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-white/80 mb-8">
                  Explore our comprehensive Licensing Framework, register a .bw domain, or file a consumer complaint — all from one digital platform.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/licensing">
                    <Button size="lg" className="bg-bocra-yellow hover:bg-bocra-yellow-light text-bocra-navy font-semibold text-lg px-8 shadow-xl">
                      Apply for a Licence
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold text-lg px-8">
                      Explore Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
