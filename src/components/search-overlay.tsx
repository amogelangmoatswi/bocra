"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText, Globe, MessageSquare, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const SEARCH_RESULTS = [
  { group: "Pages", items: [
    { label: "Licensing Portal", href: "/licensing", icon: FileText, desc: "Apply for or renew your communication licenses." },
    { label: "Consumer Complaints", href: "/complaints", icon: MessageSquare, desc: "File a complaint against a service provider." },
    { label: ".BW Domain Search", href: "/domains", icon: Globe, desc: "Register your .bw domain name today." },
  ]},
  { group: "Services", items: [
    { label: "Type Approval", href: "/services", icon: Zap, desc: "Equipment certification for networks." },
    { label: "Cybersecurity (bwCIRT)", href: "/cybersecurity", icon: Zap, desc: "Report incidents and view advisories." },
  ]}
];

export function SearchOverlay({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-bocra-navy">
        <DialogHeader className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search BOCRA services, documents, news..."
              className="border-none focus-visible:ring-0 text-lg p-0 h-auto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">ESC</Badge>
            </div>
          </div>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto p-2 pb-4 scrollbar-thin">
          {query.length > 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p>Searching for <span className="text-foreground font-semibold">"{query}"</span>...</p>
              <p className="text-sm mt-1">Showing simulated results for demonstration.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {SEARCH_RESULTS.map((group) => (
                <div key={group.group}>
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">{group.group}</h3>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-bocra-blue/10 flex items-center justify-center shrink-0 group-hover:bg-bocra-blue group-hover:text-white transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{item.desc}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-border/50 bg-slate-50 dark:bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1 border rounded bg-white dark:bg-background">Enter</kbd> to select</span>
            <span className="flex items-center gap-1"><kbd className="px-1 border rounded bg-white dark:bg-background">↑↓</kbd> to navigate</span>
          </div>
          <div>BOCRA Intelligent Search</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
