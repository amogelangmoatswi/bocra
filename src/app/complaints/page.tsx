"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, AlertCircle, Phone, Search, FileText, CheckCircle2, ChevronRight, UploadCloud, Lock, Loader2 } from "lucide-react";
import { submitComplaint } from "./actions";
import { createClient } from "@/lib/supabase";

export default function ComplaintsPage() {
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState("file");

  // Form State
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("other");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tracking State
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  
  useEffect(() => {
    if (session?.user && activeTab === "track") {
      fetchComplaints();
    }
  }, [session, activeTab]);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", (session?.user as any).id)
        .order("created_at", { ascending: false });
      if (data) setMyComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set("provider", provider);
    formData.set("category", category);

    const result = await submitComplaint(formData);
    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      if (activeTab === "track") fetchComplaints();
    } else {
      setSubmitError(result.error);
    }
  };

  if (authStatus === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-bocra-blue" /></div>;
  }

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden border-t-4 border-bocra-red">
        <div className="absolute inset-0 bg-bocra-blue/20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bocra-yellow/20 rounded-full blur-[100px]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 mb-6 font-semibold border-none">
            Consumer Protection
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Consumer Complaints
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Ensuring high-quality communications services. If your provider falls short, we are here to investigate and resolve issues.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* Steps to complain */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 animate-fade-in-up delay-100 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Before You File a Complaint</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-bocra-blue/10 dark:bg-white/10 -z-10"></div>
            
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-muted border-4 border-white dark:border-card flex items-center justify-center font-bold text-bocra-blue mb-4 group-hover:scale-110 group-hover:bg-bocra-blue group-hover:text-white transition-all">
                1
              </div>
              <h3 className="font-semibold mb-2">Contact Provider</h3>
              <p className="text-sm text-muted-foreground">Attempt resolution directly with your service provider first.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-muted border-4 border-white dark:border-card flex items-center justify-center font-bold text-bocra-blue mb-4 group-hover:scale-110 group-hover:bg-bocra-yellow group-hover:text-white transition-all">
                2
              </div>
              <h3 className="font-semibold mb-2">Gather Evidence</h3>
              <p className="text-sm text-muted-foreground">Collect contracts, bills, and all correspondence.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-full bg-bocra-blue border-4 border-white dark:border-card flex items-center justify-center font-bold text-white mb-4 shadow-lg group-hover:scale-110 transition-all">
                3
              </div>
              <h3 className="font-semibold mb-2 text-bocra-blue dark:text-bocra-yellow">Lodge Complaint</h3>
              <p className="text-sm text-muted-foreground">File securely using our portal below.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-muted border-4 border-white dark:border-card flex items-center justify-center font-bold text-bocra-blue mb-4 group-hover:scale-110 group-hover:bg-bocra-green group-hover:text-white transition-all">
                4
              </div>
              <h3 className="font-semibold mb-2">BOCRA Investigates</h3>
              <p className="text-sm text-muted-foreground">We review for CRA Act breaches and take action.</p>
            </div>
          </div>
        </div>

        {/* Floating Action Tabs */}
        <div className="flex justify-center mb-8 relative z-30">
          <div className="bg-white dark:bg-card p-1.5 rounded-full shadow-lg border border-border/50 inline-flex gap-1 animate-fade-in-up delay-200">
            <button
              onClick={() => setActiveTab("file")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "file"
                  ? "bg-bocra-blue text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              File a Complaint
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === "track"
                  ? "bg-bocra-blue text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Track Case Status
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 animate-fade-in-up delay-300">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-border/50 h-full">
              <CardContent className="p-6 md:p-8">
                {!session?.user ? (
                  <div className="text-center py-16 animate-fade-in-up">
                    <div className="w-20 h-20 bg-muted mx-auto rounded-full flex items-center justify-center mb-6">
                      <Lock className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      You must be logged in to securely file a new complaint or track the status of an existing investigation.
                    </p>
                    <Link href={`/login?callbackUrl=/complaints`}>
                      <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white h-12 px-8 text-base shadow-lg">
                        Log In or Register
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {activeTab === "file" ? (
                      <>
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                      <div className="w-10 h-10 rounded-full bg-bocra-blue/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-bocra-blue" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-bold">New Complaint Form</h2>
                         <p className="text-sm text-muted-foreground">Fields marked with an asterisk (*) are required.</p>
                       </div>
                     </div>
                     
                     {submitSuccess ? (
                       <div className="text-center py-12 animate-fade-in">
                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <CheckCircle2 className="w-8 h-8 text-green-600" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2">Complaint Submitted</h3>
                         <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                           Your complaint has been securely submitted to BOCRA. You can track its progress in the "Track Case Status" tab.
                         </p>
                         <div className="flex justify-center gap-4">
                           <Button variant="outline" onClick={() => setSubmitSuccess(false)}>File Another</Button>
                           <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white" onClick={() => setActiveTab("track")}>Track Complaint</Button>
                         </div>
                       </div>
                     ) : (
                       <form onSubmit={handleComplaintSubmit} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <Label>Service Provider *</Label>
                             <Select value={provider} onValueChange={(val) => setProvider(val || "")} required>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select Provider" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="btc">BTC / beMOBILE</SelectItem>
                                 <SelectItem value="mascom">Mascom Wireless</SelectItem>
                                 <SelectItem value="orange">Orange Botswana</SelectItem>
                                 <SelectItem value="bofinet">BoFiNet</SelectItem>
                                 <SelectItem value="botspost">BotswanaPost</SelectItem>
                                 <SelectItem value="other">Other Service Provider</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                           
                           <div className="space-y-2">
                             <Label>Complaint Category *</Label>
                             <Select value={category} onValueChange={(val) => setCategory(val || "")} required>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select Category" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="billing">Billing & Tariffs</SelectItem>
                                 <SelectItem value="service_quality">Quality of Service (Voice/Data)</SelectItem>
                                 <SelectItem value="customer_service">Poor Customer Service</SelectItem>
                                 <SelectItem value="privacy">Privacy</SelectItem>
                                 <SelectItem value="equipment">Equipment</SelectItem>
                                 <SelectItem value="other">Other</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                         </div>
  
                         <div className="space-y-2">
                           <Label htmlFor="subject">Subject / Provider Reference Number *</Label>
                           <Input name="subject" id="subject" required placeholder="e.g. INC-2026-0345 (Required: you must have contacted them first)" />
                         </div>
  
                         <div className="space-y-2">
                           <Label htmlFor="description">Complaint Details *</Label>
                           <Textarea 
                             name="description"
                             id="description" 
                             required
                             placeholder="Please provide a detailed description of your issue, timeline, and what resolution you are seeking..." 
                             className="min-h-[150px] resize-y"
                           />
                         </div>
  
                         <div className="bg-muted/30 p-6 rounded-xl border border-dashed border-border/80 text-center hover:bg-muted/50 transition-colors">
                           <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                           <h4 className="font-semibold mb-1">Upload Evidence Documents (Optional)</h4>
                           <p className="text-xs text-muted-foreground">Support your case with bills, emails, or screenshots.</p>
                         </div>
  
                         <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
                           <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                           <div className="text-sm">
                             <p className="font-semibold text-orange-800 dark:text-orange-400 mb-1">Privacy Notice</p>
                             <p className="text-orange-700/80 dark:text-orange-200/80">
                               By submitting this complaint, your personal information will be shared with the service provider to facilitate investigation.
                             </p>
                           </div>
                         </div>
  
                         {submitError && (
                           <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                             {submitError}
                           </div>
                         )}
  
                         <Button type="submit" disabled={submitting || !provider || !category} className="w-full bg-bocra-blue hover:bg-bocra-blue-light text-white h-12 text-base font-semibold">
                           {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Complaint Securely"}
                         </Button>
                       </form>
                     )}
                   </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                      <div className="w-10 h-10 rounded-full bg-bocra-yellow/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-bocra-yellow" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Track Case Status</h2>
                        <p className="text-sm text-muted-foreground">Enter your BOCRA reference number.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {loadingComplaints ? (
                        <div className="text-center py-8 text-muted-foreground">Loading complaints...</div>
                      ) : myComplaints.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                          You haven't submitted any complaints yet.
                        </div>
                      ) : (
                        myComplaints.map(cmp => (
                          <div key={cmp.id} className="bg-slate-50 dark:bg-muted/10 rounded-xl p-6 border border-border/50">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="font-bold">{cmp.subject}</h3>
                                <p className="text-sm text-muted-foreground">{cmp.reference_number} • {cmp.provider}</p>
                              </div>
                              <Badge className="bg-bocra-yellow text-bocra-navy">{cmp.status.replace("_", " ").toUpperCase()}</Badge>
                            </div>
                            
                            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-border">
                              <div className="relative">
                                <div className="absolute -left-6 w-3 h-3 rounded-full bg-bocra-blue shadow-[0_0_0_4px_rgba(0,0,255,0.1)] mt-1.5"></div>
                                <div className="bg-white dark:bg-card p-4 rounded-lg border border-border shadow-sm">
                                  <div className="text-xs text-muted-foreground mb-1">{new Date(cmp.created_at).toLocaleString()}</div>
                                  <h4 className="font-semibold text-sm">Complaint Received</h4>
                                </div>
                              </div>
                              {cmp.status !== "submitted" && (
                              <div className="relative">
                                <div className="absolute -left-6 w-3 h-3 rounded-full bg-bocra-green shadow-[0_0_0_4px_rgba(0,168,157,0.2)] mt-1.5"></div>
                                <div className="bg-white dark:bg-card p-4 rounded-lg border border-border shadow-sm">
                                  <div className="text-xs text-muted-foreground mb-1">{new Date(cmp.updated_at).toLocaleString()}</div>
                                  <h4 className="font-semibold text-sm">Status Updated: {cmp.status.replace("_", " ")}</h4>
                                </div>
                              </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            )}
            </CardContent>
          </Card>
        </div>

          <div className="space-y-6">
            <Card className="shadow-md border-border/50 bg-bocra-blue text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              <CardContent className="p-6">
                <Phone className="w-8 h-8 text-bocra-yellow mb-4" />
                <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                <p className="text-white/80 text-sm mb-6">Our Consumer Affairs team is available Monday to Friday, 08:00 - 16:30.</p>
                <div className="space-y-3">
                  <a href="tel:+2673957755" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors text-sm font-semibold">
                    <Phone className="w-4 h-4" /> Toll Free: 161 (from landlines)
                  </a>
                  <a href="mailto:consumer@bocra.org.bw" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors text-sm font-semibold">
                    <MessageSquare className="w-4 h-4" /> consumer@bocra.org.bw
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-border/50">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-bocra-green" />
                  Common Questions
                </h3>
                <Accordion className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-semibold text-left">Which providers can I complain about?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Any service provider licensed by BOCRA, including Mobile Networks (BTC, Mascom, Orange), Internet Service Providers, Broadcasters, and Postal Operators.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm font-semibold text-left">How long does an investigation take?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Providers generally have 14 days to respond to BOCRA inquiries. Complex cases may take up to 60 days to resolve fully.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm font-semibold text-left">Can I complain anonymously?</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      While possible, anonymous complaints severely limit our ability to investigate specific billing or service issues related to your account.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button variant="link" className="w-full mt-2 text-bocra-blue dark:text-bocra-yellow p-0 h-auto justify-end group">
                  View full Qos Guidelines <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
