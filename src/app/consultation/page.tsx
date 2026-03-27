"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Clock, Download, MessageSquare, ChevronRight, Lock } from "lucide-react";


export default function ConsultationPage() {
  const { data: session } = useSession();
  const [activeConsultations, setActiveConsultations] = useState<any[]>([]);
  const [pastConsultations, setPastConsultations] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const supabase = createClient();
        // Fetch active (published) consultations
        const { data: activeData } = await supabase
          .from("public_consultations")
          .select("*")
          .eq("status", "published")
          .order("deadline", { ascending: true });
          
        if (activeData && activeData.length > 0) {
          const formatted = activeData.map((item) => {
            const today = new Date();
            const deadline = new Date(item.deadline);
            const diffTime = deadline.getTime() - today.getTime();
            const daysLeft = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
            
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              deadline: deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              daysLeft: daysLeft,
              category: "Policy",
            };
          });
          setActiveConsultations(formatted);
        }

        // Fetch closed/archived consultations
        const { data: pastData } = await supabase
          .from("public_consultations")
          .select("*")
          .eq("status", "archived")
          .order("deadline", { ascending: false });

        if (pastData && pastData.length > 0) {
          setPastConsultations(pastData.map((item) => ({
            id: item.id,
            title: item.title,
            closedDate: new Date(item.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            status: "Closed",
            category: "Policy",
          })));
        }
      } catch (err) {
        console.error("Failed to fetch consultations", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultations();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setSelectedConsultation(null);
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden border-t-4 border-bocra-blue">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0 block"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-bocra-blue/20 to-transparent z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-bocra-yellow/20 text-bocra-yellow hover:bg-bocra-yellow/30 mb-6 font-semibold border-none">
            Public Participation
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Public Consultations
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Your voice matters. Review draft regulations, guidelines, and strategies, and provide your formal input to shape Botswana's digital future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-10 mb-8 min-h-[600px]">
          
          {selectedConsultation ? (
            <div className="animate-fade-in">
              <button 
                onClick={() => setSelectedConsultation(null)}
                className="flex items-center text-sm font-semibold text-bocra-blue mb-8 hover:underline"
              >
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Consultations
              </button>

              {isSubmitted ? (
                <div className="text-center py-16 animate-fade-in-up max-w-md mx-auto">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Comment Received!</h2>
                  <p className="text-muted-foreground mb-8">
                    Thank you for your valuable input. Your comments have been securely recorded and will be reviewed by the relevant committee.
                  </p>
                  <Button onClick={() => { setSelectedConsultation(null); setIsSubmitted(false); }} className="bg-bocra-blue text-white">
                    Return to Consultations
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <Badge className="mb-3 bg-bocra-blue/10 text-bocra-blue hover:bg-bocra-blue/20">{selectedConsultation.category}</Badge>
                      <h2 className="text-3xl font-bold mb-4">{selectedConsultation.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6">
                        {selectedConsultation.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-md font-medium border border-orange-200 dark:border-orange-900">
                          <Clock className="w-4 h-4" /> Closes in {selectedConsultation.daysLeft} days
                        </div>
                      </div>
                    </div>

                    {!session?.user ? (
                      <Card className="border-border/50 shadow-sm">
                        <CardContent className="p-8 text-center animate-fade-in-up">
                          <div className="w-16 h-16 bg-muted mx-auto rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
                          <p className="text-muted-foreground mb-6">
                            You must be logged in to submit a formal comment on this consultation.
                          </p>
                          <Link href="/login?callbackUrl=/consultation">
                            <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white px-8">
                              Log In to Comment
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-slate-50 dark:bg-muted/30 border-b border-border/50">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-bocra-blue" /> Submit Your Comments
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name / Organization *</Label>
                                <Input id="name" required placeholder="e.g. John Doe or Acme Corp" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input id="email" type="email" required placeholder="john@example.com" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="stakeholderType">Stakeholder Category *</Label>
                              <Tabs defaultValue="citizen" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                  <TabsTrigger value="citizen">Private Citizen</TabsTrigger>
                                  <TabsTrigger value="operator">Licensed Operator</TabsTrigger>
                                  <TabsTrigger value="org">Organization / NGO</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="comments">Your Comments *</Label>
                              <Textarea 
                                id="comments" 
                                required 
                                placeholder="Please provide your formal feedback on the draft document here..." 
                                className="min-h-[200px]"
                              />
                            </div>

                            <div className="bg-bocra-sky dark:bg-bocra-blue/10 border border-bocra-blue/20 p-4 rounded-lg flex items-start gap-3">
                              <FileText className="w-5 h-5 text-bocra-blue shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-sm text-bocra-navy dark:text-white mb-1">Upload Attachment (Optional)</p>
                                <p className="text-xs text-muted-foreground mb-3">You can attach a formal letterhead or detailed report (PDF/Word, Max 10MB).</p>
                                <Button type="button" variant="outline" size="sm" className="bg-white dark:bg-background">Browse Files</Button>
                              </div>
                            </div>

                            <Button type="submit" className="w-full mt-4 bg-bocra-blue hover:bg-bocra-blue-light text-white h-12 text-base">
                              Submit Formal Comment
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-6">
                    <Card className="border-border/50 sticky top-28 shadow-md">
                      <CardHeader className="bg-slate-50 dark:bg-muted/30 border-b border-border/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Download className="w-5 h-5 text-bocra-blue" /> Consultation Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                          <a href="#" className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors group">
                            <div className="w-10 h-10 rounded bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold group-hover:text-bocra-blue transition-colors mb-1 shadow-sm">Draft Document.pdf</h4>
                              <p className="text-xs text-muted-foreground">2.4 MB</p>
                            </div>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Tabs defaultValue="active" className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <TabsList className="bg-slate-100 dark:bg-muted p-1">
                  <TabsTrigger value="active" className="px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-bocra-navy data-[state=active]:shadow-sm">Active Consultations</TabsTrigger>
                  <TabsTrigger value="past" className="px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-bocra-navy data-[state=active]:shadow-sm">Past Archive</TabsTrigger>
                </TabsList>
                <div className="relative max-w-sm w-full">
                  <Input placeholder="Search consultations..." className="pl-10 bg-slate-50 dark:bg-muted/30" />
                  <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <TabsContent value="active" className="space-y-6 focus-visible:outline-none">
                {loading ? (
                  <div className="text-center py-16 text-muted-foreground">Loading consultations...</div>
                ) : activeConsultations.length === 0 ? (
                  <div className="text-center py-16">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="font-bold text-lg mb-2">No Active Consultations</h3>
                    <p className="text-muted-foreground">There are currently no open public consultations. Check back soon.</p>
                  </div>
                ) : (
                activeConsultations.map((item, i) => (
                  <Card key={item.id} className={`group hover:border-bocra-blue/50 hover:shadow-md transition-all border-border/50 animate-fade-in-up`} style={{ animationDelay: `${i*100}ms` }}>
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-xs uppercase tracking-wider">{item.category}</Badge>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-bocra-blue transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed max-w-3xl">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-md">
                            <Clock className="w-4 h-4" /> Closes in {item.daysLeft} days
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4" /> Deadline: {item.deadline}
                          </span>
                        </div>
                      </div>
                      <div className="flex md:flex-col justify-end md:justify-center items-center gap-3 md:border-l md:border-border/50 md:pl-6 md:w-48 shrink-0">
                        <Button className="w-full bg-bocra-blue hover:bg-bocra-blue-light text-white" onClick={() => setSelectedConsultation(item)}>
                          Participate <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-6 focus-visible:outline-none">
                {pastConsultations.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="font-bold text-lg mb-2">No Past Consultations</h3>
                    <p className="text-muted-foreground">No archived consultations yet.</p>
                  </div>
                ) : (
                pastConsultations.map((item) => (
                  <Card key={item.id} className="border-border/50 opacity-80 hover:opacity-100 transition-opacity">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 w-full relative">
                        <div className="block md:hidden absolute right-0 top-0">
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-muted text-slate-700 dark:text-slate-300 pointer-events-none">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="text-xs uppercase tracking-wider">{item.category}</Badge>
                        </div>
                        <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> Closed: {item.closedDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col justify-end items-center gap-3 md:border-l md:border-border/50 md:pl-6 md:w-48 shrink-0 w-full md:w-auto">
                        <div className="hidden md:block">
                          <Badge variant="secondary" className="bg-slate-100 dark:bg-muted text-slate-700 dark:text-slate-300 pointer-events-none w-full justify-center py-1">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
                )}
              </TabsContent>
            </Tabs>
          )}

        </div>
      </div>
    </div>
  );
}
