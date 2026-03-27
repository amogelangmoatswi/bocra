"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { submitLicenceApplication } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText, CheckCircle2, Clock, AlertCircle, Lock, ChevronRight,
  Building2, User, Phone, Mail, ArrowLeft, Loader2, FileSearch, MessageSquare, HeadphonesIcon
} from "lucide-react";

const LICENCE_TYPES = [
  { value: "nfp_individual", label: "Network Facilities Provider (Individual)" },
  { value: "nfp_class", label: "Network Facilities Provider (Class)" },
  { value: "ecs_individual", label: "Electronic Communications Service (Individual)" },
  { value: "ecs_class", label: "Electronic Communications Service (Class)" },
  { value: "spectrum", label: "Spectrum / Frequency Assignment" },
  { value: "type_approval", label: "Type Approval (Equipment)" },
  { value: "postal", label: "Postal Operator Licence" },
  { value: "courier", label: "Courier Service Licence" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  draft: { label: "Draft", bg: "bg-slate-100", text: "text-slate-700", icon: FileText },
  submitted: { label: "Submitted", bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  under_review: { label: "Under Review", bg: "bg-yellow-100", text: "text-yellow-700", icon: AlertCircle },
  approved: { label: "Approved", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
  expired: { label: "Expired", bg: "bg-slate-100", text: "text-slate-500", icon: Clock },
};

export default function LicenceApplyPage() {
  const { data: session, status: authStatus } = useSession();
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [licenceType, setLicenceType] = useState("");
  const [loadingApps, setLoadingApps] = useState(true);

  // Fetch user's existing applications
  useEffect(() => {
    if (!session?.user) return;
    const fetchApps = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("licence_applications")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setMyApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, [session, step]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("licence_type", licenceType);

    const result = await submitLicenceApplication(formData);
    setSubmitting(false);

    if (result.success) {
      setStep("success");
    } else {
      setError(result.error);
    }
  };

  // Loading Session
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-bocra-blue" />
      </div>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-background relative overflow-hidden flex flex-col justify-center pb-24">
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-bocra-blue/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-bocra-green/10 blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md mx-auto px-4 relative z-10 animate-fade-in-up">
          <Link href="/licensing" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Licensing
          </Link>
          
          <Card className="border-border/60 shadow-2xl bg-card/80 backdrop-blur-xl">
            <div className="h-2 w-full bg-gradient-to-r from-bocra-blue via-bocra-green to-bocra-yellow"></div>
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-muted/50 flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-background">
                <Lock className="w-8 h-8 text-bocra-navy dark:text-white/60" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-3">Authentication Required</h1>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                You must be logged into your BOCRA account to submit, track, or manage licensing applications.
              </p>
              <Link href="/login?callbackUrl=/licensing/apply" className="block w-full">
                <Button className="w-full h-12 bg-bocra-blue hover:bg-bocra-blue-light text-white font-semibold text-base shadow-lg shadow-bocra-blue/20 transition-all hover:-translate-y-0.5">
                  Secure Log In <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-slate-50/30 dark:bg-background min-h-screen">
      {/* Dynamic Header */}
      <div className="bg-bocra-navy pt-24 pb-20 px-4 relative overflow-hidden border-b-4 border-bocra-blue">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover mix-blend-overlay"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/licensing" className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalogue
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Badge className="bg-bocra-green/20 text-bocra-green border-none mb-4 px-3 py-1 text-xs uppercase tracking-wider">Application Form</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Apply for a Licence</h1>
              <p className="text-lg text-white/80 max-w-2xl font-light">
                Submit your official application securely to the Authority for review and processing.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">Secure Portal</div>
                <div className="text-white/60 text-xs">256-bit Encryption</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            {step === "success" ? (
              <Card className="border-border/50 shadow-2xl animate-fade-in-up bg-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                <CardContent className="p-10 md:p-14 text-center">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 tracking-tight">Application Submitted Successfully!</h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Your application has been received and securely logged in our system. An official reference number has been assigned.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => { setStep("form"); setLicenceType(""); }} variant="outline" className="h-12 px-6">
                      Submit Another Application
                    </Button>
                    <Link href="/licensing">
                      <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white h-12 px-8">Back to Licensing</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 shadow-xl bg-card">
                <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-muted/10 p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bocra-blue/10 flex items-center justify-center text-bocra-blue font-bold">1</div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">Application Details</CardTitle>
                      <CardDescription className="text-sm mt-1">Fields marked with an asterisk (*) are mandatory.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* Semantic Section 1 */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <FileText className="w-5 h-5 text-bocra-green" />
                        <h3 className="text-lg font-semibold text-foreground">Licence Profile</h3>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Select Licence Category *</Label>
                        <Select value={licenceType} onValueChange={(val) => setLicenceType(val || "")} required>
                          <SelectTrigger className="h-14 bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base rounded-xl">
                            <SelectValue placeholder="Choose the appropriate licence framework" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {LICENCE_TYPES.map((lt) => (
                              <SelectItem key={lt.value} value={lt.value} className="py-3 cursor-pointer">
                                {lt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Semantic Section 2 */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Building2 className="w-5 h-5 text-bocra-green" />
                        <h3 className="text-lg font-semibold text-foreground">Business Entities</h3>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="company_name" className="text-sm font-medium">Registered Company / Individual Name *</Label>
                        <Input 
                          id="company_name" 
                          name="company_name" 
                          required 
                          placeholder="e.g. Botswana Telecommunications Corporation Ltd" 
                          className="h-14 bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base rounded-xl" 
                        />
                      </div>
                    </div>

                    {/* Semantic Section 3 */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <User className="w-5 h-5 text-bocra-green" />
                        <h3 className="text-lg font-semibold text-foreground">Primary Contact</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="contact_person" className="text-sm font-medium">Full Name (Contact Person) *</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                              id="contact_person" 
                              name="contact_person" 
                              required 
                              placeholder="John Doe" 
                              className="pl-12 h-14 bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base rounded-xl" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="contact_email" className="text-sm font-medium">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input 
                              id="contact_email" 
                              name="contact_email" 
                              type="email" 
                              required 
                              placeholder="john@example.co.bw" 
                              className="pl-12 h-14 bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base rounded-xl" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="contact_phone" className="text-sm font-medium">Phone Number (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            id="contact_phone" 
                            name="contact_phone" 
                            placeholder="+267 71 234 567" 
                            className="pl-12 h-14 bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base rounded-xl" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Semantic Section 4 */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <FileSearch className="w-5 h-5 text-bocra-green" />
                        <h3 className="text-lg font-semibold text-foreground">Service Specification</h3>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-sm font-medium">Brief Description of Intended Service</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Please provide a concise overview of the services you intend to offer under this licence (Optional)..."
                          className="min-h-[140px] bg-muted/50 border-transparent focus:bg-background focus:border-bocra-blue/50 focus:ring-bocra-blue/20 transition-all text-base p-4 rounded-xl resize-y"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-3 animate-fade-in-up">
                        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div className="font-medium leading-relaxed">{error}</div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-border/50">
                      <Button
                        type="submit"
                        disabled={submitting || !licenceType}
                        className="w-full h-14 bg-bocra-blue hover:bg-bocra-blue-light text-white text-lg font-bold rounded-xl shadow-lg shadow-bocra-blue/20 transition-all hover:-translate-y-0.5"
                      >
                        {submitting ? (
                          <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing Application...</>
                        ) : (
                          <>Securely Submit Application <ChevronRight className="w-5 h-5 ml-2" /></>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By submitting this application, you agree to BOCRA's terms of data processing and framework regulations.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* My Applications Widget */}
            <Card className="shadow-xl border-border/60 bg-card rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-muted/10 border-b border-border/50 py-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-muted-foreground" /> Document Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingApps ? (
                  // Custom Skeleton Loader
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map((skeleton) => (
                      <div key={skeleton} className="flex gap-4 animate-pulse">
                        <div className="w-2 h-12 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myApplications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileSearch className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">No Active Filings</p>
                    <p className="text-xs text-muted-foreground">Submit a form to begin tracking.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {myApplications.map((app) => {
                      const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.draft;
                      const StatusIcon = config.icon;
                      
                      return (
                        <div key={app.id} className="p-5 hover:bg-slate-50 dark:hover:bg-muted/10 transition-colors group cursor-default">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="font-mono text-[10px] tracking-wider bg-background shadow-sm px-2 py-0.5 uppercase border-border">
                              {app.reference_number}
                            </Badge>
                            <Badge className={`${config.bg} ${config.text} border-none text-[10px] font-bold px-2 py-0.5 shadow-none`}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-bocra-blue transition-colors">
                            {app.company_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5 leading-snug line-clamp-2">
                            {LICENCE_TYPES.find((lt) => lt.value === app.licence_type)?.label || app.licence_type}
                          </p>
                          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/40">
                            <StatusIcon className={`w-3.5 h-3.5 ${config.text}`} />
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                              Filed: {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Widget */}
            <Card className="bg-gradient-to-br from-bocra-navy to-slate-900 border-none shadow-xl text-white overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5 backdrop-blur-md border border-white/20">
                  <HeadphonesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Assistance</h3>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  Stuck on a framework requirement? Our licensing division is standing by to assist with your operational setup.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-bocra-yellow" />
                    <a href="mailto:licensing@bocra.org.bw" className="text-sm font-semibold hover:text-bocra-yellow transition-colors">licensing@bocra.org.bw</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-bocra-yellow" />
                    <span className="text-sm font-semibold">+267 368-5500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
