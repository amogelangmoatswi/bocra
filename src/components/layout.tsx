"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "./language-provider";
import { SearchOverlay } from "./search-overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, Globe, BarChart3, Users, MessageSquare, Phone, Info, Home, FileText, Sun, Moon, Accessibility, Mail, ChevronDown, UserCircle, LogOut, LogIn, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [contrastActive, setContrastActive] = useState(false);

  const [realTimeRole, setRealTimeRole] = useState<string | null>(null);

  // Fetch real-time role from Supabase to bypass NextAuth session caching
  useEffect(() => {
    if (session?.user?.email) {
      const fetchRole = async () => {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('email', session.user!.email)
            .single();
          if (data?.role) {
            setRealTimeRole(data.role);
          }
        } catch (err) {
          console.error("Error fetching real-time role:", err);
        }
      };
      fetchRole();
    } else {
      setRealTimeRole(null);
    }
  }, [session?.user?.email]);

  const role = realTimeRole || (session?.user as any)?.role;

  const getNavItems = useCallback(() => {
    // ADMIN NAVIGATION
    if (role === 'admin') {
      return [
        { href: "/admin", label: "Admin Panel", icon: ShieldCheck },
        { href: "/admin/news", label: "Manage News", icon: FileText },
        { href: "/admin/consultations", label: "Consultations", icon: Users },
        { href: "/admin/cybersecurity", label: "Cyber Alerts", icon: Shield },
        {
          href: "#",
          label: "Live Site",
          icon: Globe,
          children: [
            { href: "/", label: "Home Page" },
            { href: "/about", label: "About BOCRA" },
            { href: "/complaints", label: "Complaints Portal" },
            { href: "/contact", label: "Contact Us" },
          ],
        },
      ];
    }

    // USER NAVIGATION
    if (role === 'user') {
      return [
        { href: "/dashboard", label: "My Dashboard", icon: BarChart3 },
        { href: "/licensing", label: "My Licences", icon: FileText },
        { href: "/complaints", label: "My Complaints", icon: MessageSquare },
        { href: "/domains", label: "My Domains", icon: Globe },
        {
          href: "#",
          label: "Public Info",
          icon: Info,
          children: [
            { href: "/", label: "Home Page" },
            { href: "/about", label: "About BOCRA" },
            { href: "/cybersecurity", label: "bwcirt Cyber Hub" },
            { href: "/consultation", label: "Public Consultations" },
            { href: "/documents", label: "Documents & Legislation" },
            { href: "/tenders", label: "Tenders" },
            { href: "/faqs", label: "FAQs" },
            { href: "/contact", label: "Contact Us" },
          ],
        },
      ];
    }

    // PUBLIC NAVIGATION (LOGGED OUT)
    return [
      { href: "/", label: t("home"), icon: Home },
      { href: "/about", label: t("about"), icon: Info },
      {
        href: "#",
        label: t("services"),
        icon: Globe,
        children: [
          { href: "/domains", label: ".BW Domains" },
          { href: "/cybersecurity", label: "Cybersecurity Hub" },
          { href: "/complaints", label: "File a Complaint" },
        ],
      },
      {
        href: "#",
        label: "Resources",
        icon: FileText,
        children: [
          { href: "/documents", label: "Documents & Legislation" },
          { href: "/tenders", label: "Tenders & Procurement" },
          { href: "/consultation", label: "Public Consultations" },
          { href: "/faqs", label: "FAQs" },
        ],
      },
      { href: "/contact", label: t("contact"), icon: Phone },
    ];
  }, [role, t]);

  const navItems = getNavItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  }, []);

  const toggleContrast = useCallback(() => {
    setContrastActive((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle("high-contrast", next);
      }
      return next;
    });
  }, []);

  return (
    <>
      <SearchOverlay open={searchOpen} setOpen={setSearchOpen} />
      {/* Sector colour strip */}
      <div className="h-1 flex">
        <div className="flex-1 bg-bocra-blue"></div>
        <div className="flex-1 bg-bocra-green"></div>
        <div className="flex-1 bg-bocra-red"></div>
        <div className="flex-1 bg-bocra-yellow"></div>
      </div>
      {/* Top bar */}
      <div className="bg-bocra-blue text-white text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+2673957755" className="flex items-center gap-1 hover:text-bocra-yellow-light transition-colors">
              <Phone className="w-3 h-3" />
              +267 395-7755
            </a>
            <a href="mailto:info@bocra.org.bw" className="flex items-center gap-1 hover:text-bocra-yellow-light transition-colors">
              <Mail className="w-3 h-3" />
              info@bocra.org.bw
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-full px-1 py-0.5 border border-white/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`px-3 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-white text-bocra-navy' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("tn")}
                className={`px-3 py-0.5 rounded-full text-[10px] font-bold transition-all ${language === 'tn' ? 'bg-white text-bocra-navy' : 'text-white/60 hover:text-white'}`}
              >
                TN
              </button>
            </div>
            
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <button onClick={toggleDark} className="hover:text-bocra-yellow-light transition-colors" aria-label="Toggle dark mode">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger 
                  render={
                    <button className="hover:text-bocra-yellow-light transition-colors p-2 rounded-lg" aria-label="Accessibility options" />
                  }
                >
                  <Accessibility className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={toggleContrast} className="flex justify-between items-center cursor-pointer">
                    High Contrast {contrastActive && <Badge className="bg-bocra-green text-white">ON</Badge>}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                    Larger Text <Badge variant="outline">SOON</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                    Screen Reader Mode <Badge variant="outline">SOON</Badge>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg"
            : "bg-white/95 dark:bg-bocra-navy/95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
              <img 
                src="/bocra-logo.svg" 
                alt="BOCRA Logo" 
                className="h-10 md:h-12 w-auto" 
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href || item.children?.some(child => pathname === child.href);
                const Icon = item.icon;
                if (item.children) {
                  return (
                    <div
                      key={item.label}
                      className="relative group"
                      onMouseEnter={() => setDropdownOpen(item.label)}
                      onMouseLeave={() => setDropdownOpen(null)}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-bocra-blue/10 text-bocra-blue dark:text-bocra-yellow"
                            : "text-foreground/70 hover:text-bocra-blue hover:bg-bocra-blue/5 dark:hover:text-bocra-yellow"
                        }`}
                        aria-expanded={dropdownOpen === item.label}
                        aria-haspopup="true"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      <div 
                        className={`absolute top-full left-0 pt-2 transition-all duration-200 ${
                          dropdownOpen === item.label 
                            ? 'opacity-100 translate-y-0 visible' 
                            : 'opacity-0 -translate-y-2 invisible'
                        }`}
                      >
                        <div className="w-64 bg-white dark:bg-bocra-navy rounded-xl shadow-xl border border-border/50 overflow-hidden">
                          <div className="p-2">
                            {item.children.map((child, idx) => {
                              const isChildActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                                    isChildActive
                                      ? 'bg-bocra-blue text-white font-medium'
                                      : 'text-foreground/70 hover:bg-bocra-blue/10 hover:text-bocra-blue dark:hover:text-bocra-yellow'
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-white' : 'bg-bocra-blue/30'}`} />
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                          <div className="px-3 py-2 bg-muted/50 border-t border-border/50">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                              {item.label === "Services" || item.label === t("services") ? "Online Services" : 
                               item.label === "Resources" ? "Public Resources" :
                               item.label === "Public Info" ? "Information" :
                               item.label === "Live Site" ? "Public Pages" : item.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-bocra-blue/10 text-bocra-blue dark:text-bocra-yellow"
                        : "text-foreground/70 hover:text-bocra-blue hover:bg-bocra-blue/5 dark:hover:text-bocra-yellow"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex relative group" 
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-4 h-4" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ctrl+K</span>
              </Button>
              <Link href="/licensing">
                <Button className="hidden md:flex bg-bocra-blue hover:bg-bocra-blue-light text-white shadow-md">
                  {t("apply")}
                </Button>
              </Link>

              {/* Auth Button */}
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-bocra-blue/10 hover:bg-bocra-blue/20 transition-colors" aria-label="User menu" />
                    }
                  >
                    <div className="w-7 h-7 rounded-full bg-bocra-blue flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-foreground hidden lg:inline">{session.user.name}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 hidden lg:inline-flex uppercase">
                      {role || "user"}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserCircle className="w-4 h-4 mr-2" /> My Profile
                      </DropdownMenuItem>
                    </Link>
                    {(session.user as any).role === "admin" && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer text-bocra-blue dark:text-bocra-yellow focus:text-bocra-blue">
                          <ShieldCheck className="w-4 h-4 mr-2" /> Admin Panel
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-red-500 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="hidden md:block">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger 
                  render={
                    <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />
                  }
                >
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/bocra-logo.svg" alt="BOCRA" className="h-8 w-auto" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'tn' : 'en')} className="text-xs font-bold">
                          {language === 'en' ? 'TN' : 'EN'}
                        </Button>
                        <button onClick={toggleDark} className="p-2">
                          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || item.children?.some(child => pathname === child.href);
                        return (
                          <div key={item.label} className="space-y-1">
                            {item.href !== "#" ? (
                              <Link
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                  isActive
                                    ? "bg-bocra-blue text-white"
                                    : "text-foreground/70 hover:bg-muted"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </Link>
                            ) : (
                              <div className="px-4 py-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  <Icon className="w-3.5 h-3.5" />
                                  {item.label}
                                </div>
                              </div>
                            )}
                            
                            {item.children && (
                              <div className="ml-4 pl-4 border-l-2 border-bocra-blue/20 flex flex-col space-y-0.5">
                                {item.children.map((child) => {
                                  const isChildActive = pathname === child.href;
                                  return (
                                    <Link
                                      key={child.label}
                                      href={child.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                        isChildActive
                                          ? "bg-bocra-blue/10 text-bocra-blue dark:text-bocra-yellow font-medium"
                                          : "text-foreground/60 hover:text-bocra-blue hover:bg-bocra-blue/5 dark:hover:text-bocra-yellow"
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${isChildActive ? 'bg-bocra-blue' : 'bg-muted-foreground/30'}`} />
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {session?.user && (session.user as any).role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors mt-4 ${
                            pathname.startsWith("/admin")
                              ? "bg-bocra-blue/10 text-bocra-blue dark:text-bocra-yellow"
                              : "text-bocra-blue dark:text-bocra-yellow bg-bocra-blue/5 hover:bg-bocra-blue/10"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                    </nav>
                    <div className="p-4 border-t border-border space-y-3">
                      {session?.user && (
                        <Button 
                          variant="outline" 
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => {
                            setMobileOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                      )}
                      <Link href="/licensing" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-bocra-blue hover:bg-bocra-blue-light text-white">
                          {t("apply")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-bocra-navy text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4 bg-white/95 p-3 rounded-xl inline-block">
              <img src="/bocra-logo.svg" alt="BOCRA Logo" className="h-10 w-auto" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Botswana Communications Regulatory Authority — promoting competition, innovation,
              consumer protection, and universal access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-bocra-yellow mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: t("about") },
                { href: "/services", label: t("services") },
                { href: "/licensing", label: t("licensing") },
                { href: "/complaints", label: t("complaints") },
                { href: "/documents", label: "Documents & Legislation" },
                { href: "/tenders", label: "Tenders" },
                { href: "/faqs", label: "FAQs" },
                { href: "/consultation", label: t("consultations") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-bocra-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-bocra-green mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/licensing", label: "Licence Application" },
                { href: "/domains", label: ".BW Domain Registry" },
                { href: "/cybersecurity", label: "Cybersecurity (bwCIRT)" },
                { href: "/dashboard", label: "QoS Monitoring" },
                { href: "/services", label: "Spectrum Management" },
                { href: "/services", label: "Type Approval" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-bocra-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-bocra-red mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 text-bocra-green" />
                Plot No. 50671, Independence Avenue, Gaborone, Botswana
              </li>
              <li>
                <a href="tel:+2673957755" className="flex items-center gap-2 hover:text-bocra-yellow transition-colors">
                  <Phone className="w-4 h-4 text-bocra-green" />
                  +267 395-7755
                </a>
              </li>
              <li>
                <a href="mailto:info@bocra.org.bw" className="flex items-center gap-2 hover:text-bocra-yellow transition-colors">
                  <Mail className="w-4 h-4 text-bocra-green" />
                  info@bocra.org.bw
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sector colour strip */}
      <div className="h-1 flex">
        <div className="flex-1 bg-bocra-blue"></div>
        <div className="flex-1 bg-bocra-green"></div>
        <div className="flex-1 bg-bocra-red"></div>
        <div className="flex-1 bg-bocra-yellow"></div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Botswana Communications Regulatory Authority. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-bocra-yellow transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-bocra-yellow transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-bocra-yellow transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
