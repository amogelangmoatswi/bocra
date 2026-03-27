"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Globe, CheckCircle2, Shield, Settings, Server, ChevronRight, XCircle, Info, FileText, Database, Users, Lock, Loader2 } from "lucide-react";
import { registerDomain } from "./actions";

export default function DomainsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<"idle" | "available" | "taken">("idle");
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSearchResult("idle");
    setRegisterError("");
    
    setTimeout(() => {
      setIsSearching(false);
      // Simple mock logic: if it contains "bocra", "gov", or "test", it's taken
      if (/bocra|gov|test/i.test(searchTerm)) {
        setSearchResult("taken");
      } else {
        setSearchResult("available");
      }
    }, 1200);
  };

  const handleRegister = async () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=/domains");
      return;
    }

    setIsRegistering(true);
    setRegisterError("");
    
    const domainToRegister = searchTerm.includes(".bw") ? searchTerm : `${searchTerm}.bw`;
    const result = await registerDomain(domainToRegister);
    
    setIsRegistering(false);
    if (result.success) {
      router.push("/domains/manage");
    } else {
      setRegisterError(result.error || "Failed to register domain.");
    }
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="bg-bocra-navy pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,168,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,168,157,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,_black_40%,_transparent_100%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-bocra-green/20 text-bocra-green border-none mb-6 font-semibold tracking-wider">
            #pushabw #switchtobw
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Switch to .bw
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Are you in need of an Online presence? Secure a more easily remembered and shorter URL for your website or email. We are Safe, Secure and Identifiable for your potential customers in Botswana.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="bg-bocra-green hover:bg-bocra-green/90 text-white font-bold border-none px-6">
              Purchase a Domain
            </Button>
            <Link href="/domains/manage">
              <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 px-6">
                Log into Registry Portal
              </Button>
            </Link>
            <Button className="bg-white hover:bg-gray-100 text-bocra-green font-bold px-6">
              Become a Registrar
            </Button>
            <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 px-6">
              WHOIS Lookup
            </Button>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex bg-white rounded-xl overflow-hidden p-1">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-6 h-6 text-muted-foreground shrink-0" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value.toLowerCase().replace(/[^a-z0-9-.]/g, ''))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Find your perfect domain name..." 
                  className="border-none shadow-none text-lg h-14 focus-visible:ring-0 px-4 text-slate-900"
                />
                <div className="text-2xl font-bold text-bocra-green shrink-0">.bw</div>
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-bocra-green hover:bg-bocra-green-light text-white h-14 px-8 text-lg rounded-lg shrink-0"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 mb-24">
        {/* Search Results */}
        {searchResult !== "idle" && (
          <div className={`p-8 rounded-2xl shadow-xl flex flex-col items-center justify-between gap-6 mb-12 animate-fade-in ${
            searchResult === "available" ? "bg-white dark:bg-card border-2 border-green-500" : "bg-slate-50 dark:bg-muted/10 border-2 border-red-200"
          }`}>
            <div className="flex flex-col md:flex-row items-center w-full justify-between gap-6">
              <div className="flex items-center gap-4">
                {searchResult === "available" ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500 shrink-0" />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {searchTerm.includes(".bw") ? searchTerm : `${searchTerm}.bw`}
                  </h3>
                  <p className={`text-lg ${searchResult === "available" ? "text-green-600" : "text-red-500"}`}>
                    {searchResult === "available" ? "is available!" : "is already taken."}
                  </p>
                </div>
              </div>
              
              {searchResult === "available" ? (
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-2xl font-bold text-bocra-green">P250</div>
                      <div className="text-sm text-muted-foreground">/year</div>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={handleRegister} 
                      disabled={isRegistering}
                      className="w-full md:w-auto bg-bocra-green hover:bg-bocra-green/90 text-white font-bold text-lg px-8 shadow-md"
                    >
                      {isRegistering ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Registering...</> : "Register Now"}
                    </Button>
                  </div>
                  {registerError && <p className="text-red-500 text-sm mt-2">{registerError}</p>}
                </div>
              ) : (
                <Button variant="outline" size="lg" onClick={() => {setSearchTerm(""); setSearchResult("idle")}}>
                  Try another name
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="bg-card border-border/50 text-center py-6">
            <div className="text-3xl font-bold text-bocra-navy dark:text-white mb-1">10,000+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Domains</div>
          </Card>
          <Card className="bg-card border-border/50 text-center py-6">
            <div className="text-3xl font-bold text-bocra-navy dark:text-white mb-1">70+</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Registrars</div>
          </Card>
          <Card className="bg-card border-border/50 text-center py-6 md:col-span-2">
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['ac.bw', 'org.bw', 'net.bw', 'co.bw', 'gov.bw', 'shop.bw', 'agric.bw', 'me.bw'].map(z => (
                <Badge key={z} variant="secondary" className="text-sm py-1 px-3 bg-muted hover:bg-muted/80">{z}</Badge>
              ))}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-3">Active Zones</div>
          </Card>
        </div>

        <Tabs defaultValue="why" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-8 bg-transparent h-auto p-0 gap-2 border-b rounded-none hide-scrollbar">
            <TabsTrigger value="why" className="rounded-t-lg rounded-b-none data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-bocra-green pb-3 pt-3">Why .bw?</TabsTrigger>
            <TabsTrigger value="who" className="rounded-t-lg rounded-b-none data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-bocra-green pb-3 pt-3">Who Are We?</TabsTrigger>
            <TabsTrigger value="history" className="rounded-t-lg rounded-b-none data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-bocra-green pb-3 pt-3">Mandate & History</TabsTrigger>
            <TabsTrigger value="registrars" className="rounded-t-lg rounded-b-none data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-bocra-green pb-3 pt-3">Registrars</TabsTrigger>
            <TabsTrigger value="policies" className="rounded-t-lg rounded-b-none data-[state=active]:bg-muted/50 data-[state=active]:border-b-2 data-[state=active]:border-bocra-green pb-3 pt-3">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="why" className="animate-fade-in">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Why Register a .bw Domain?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We are the right local domain extension that lets people know from a blink of an eye, who You are Online!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-border/50 hover:border-bocra-green/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-bocra-green/10 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-bocra-green" />
                    </div>
                    <CardTitle>Identifiable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">.bw domains are a brand identity Unique and locally relevant to Botswana. #pushabw</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-bocra-green/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-bocra-green/10 flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-bocra-green" />
                    </div>
                    <CardTitle>Affordable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Our Registry does not charge accredited Registrars maintenance fees – another fee not to worry about as you purchase your domain.</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-bocra-green/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-bocra-green/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-bocra-green" />
                    </div>
                    <CardTitle>Timely</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Excellent customer service. Have your queries resolved in just 24hrs or less. Customer satisfaction is our new marketing strategy!</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-bocra-navy/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-bocra-navy/10 flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-bocra-navy" />
                    </div>
                    <CardTitle>Safe & Secure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Our secure DNS runs DNSSec to protect integrity. Trust the Netcraft anti-phishing tool to detect & takedown attacks.</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-green-500/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>Trusted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Trust in our numbers as they reflect over 8,800 domains registered. Be Part of this awesome community!</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 hover:border-orange-500/50 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                      <Info className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle>Fair</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Well regulated with Policies. Your brand is protected and all .bw domains are registered fairly on a first come first serve basis.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="who" className="animate-fade-in">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold mb-6">Who Are We?</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The .bw ccTLD is Botswana's National resource under the delegation of Botswana Communications Regulatory Authority – BOCRA. The supervision is handled exclusively by BOCRA serving public and industrial interests in accordance with the CRA Act 2012.
              </p>

              <h3 className="text-2xl font-bold mb-6">The 3-R Model of the DNS Industry</h3>
              <div className="grid gap-6">
                <div className="bg-slate-50 dark:bg-muted/10 border p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-xl bg-bocra-green/10 flex items-center justify-center shrink-0">
                    <Database className="w-8 h-8 text-bocra-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-bocra-green mb-2">Registry</h4>
                    <p className="text-muted-foreground mb-4">Organization charged with the responsibility of managing and maintaining the database of all domain names and the infrastructure that support the registration.</p>
                    <Button variant="outline" size="sm">Log into Registry</Button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-muted/10 border p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-xl bg-bocra-green/10 flex items-center justify-center shrink-0">
                    <Settings className="w-8 h-8 text-bocra-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-bocra-green mb-2">Registrar</h4>
                    <p className="text-muted-foreground mb-4">Entity accredited by BOCRA to implement domain registration activities on the registry. Upon a domain registration request from a Registrant, a Registrar reserves the domain.</p>
                    <Button variant="outline" size="sm">Apply to become a registrar</Button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-muted/10 border p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-xl bg-bocra-green/10 flex items-center justify-center shrink-0">
                    <Users className="w-8 h-8 text-bocra-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-bocra-green mb-2">Registrant</h4>
                    <p className="text-muted-foreground mb-4">Organization or individual registering the domain names.</p>
                    <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Purchase a Domain</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Mandate</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  As the telecommunications regulator, BOCRA has full government support and mandate to manage, operate and regulate the .BW ccTLD in a manner that complies with International best practices and policies.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Act as a trustee for the .BW country-code-top-level-domain.",
                    "Become the administrative contact as well as technical contact.",
                    "Administer the .BW ccTLD and its Second Level Domains.",
                    "Maintain and promote operational stability and utility.",
                    "Ensure cost-effective administration of sub-domains.",
                    "Provide secure and stable name service."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-bocra-green shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">.bw History</h3>
                <div className="relative border-l-2 border-border pl-6 pb-4 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-bocra-green rounded-full ring-4 ring-white dark:ring-background"></div>
                    <h4 className="font-bold">The Beginning</h4>
                    <p className="text-sm text-muted-foreground mt-2">First operated by the University of Botswana. Later transferred to Botswana Telecommunications Corporation (BTC).</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-bocra-green rounded-full ring-4 ring-white dark:ring-background"></div>
                    <h4 className="font-bold">2009</h4>
                    <p className="text-sm text-muted-foreground mt-2">Government mandated BTA to take over operations for neutrality.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 bg-bocra-green rounded-full ring-4 ring-white dark:ring-background"></div>
                    <h4 className="font-bold">2012 - 2013</h4>
                    <p className="text-sm text-muted-foreground mt-2">Redelegation process completed successfully. Registry remains under BTA, now BOCRA.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registrars" className="animate-fade-in">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Application Process For Registrars</h2>
              <p className="text-lg text-muted-foreground mb-8">BOCRA supports a Registry/Registrar model. Find out how to become an accredited registrar in 6 easy steps.</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">1</div>
                  <h4 className="font-bold mb-2">Download Form</h4>
                  <p className="text-sm text-muted-foreground relative z-10">All Applicants intending to get accredited as .bw Registrars should download the accreditation form.</p>
                </div>
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">2</div>
                  <h4 className="font-bold mb-2">Ensure Completeness</h4>
                  <p className="text-sm text-muted-foreground relative z-10">Supply all documents. Avoid misleading info. Ensure no defects. Attach signed Registrar Agreement and Fees.</p>
                </div>
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">3</div>
                  <h4 className="font-bold mb-2">Review Notification</h4>
                  <p className="text-sm text-muted-foreground relative z-10">For any incomplete Application, BOCRA will inform the affected Applicant immediately and advise accordingly.</p>
                </div>
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">4</div>
                  <h4 className="font-bold mb-2">Processing</h4>
                  <p className="text-sm text-muted-foreground relative z-10">BOCRA will inform the Applicant by email that processing will proceed. The accreditation process takes at most 7 working days.</p>
                </div>
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">5</div>
                  <h4 className="font-bold mb-2">Verification</h4>
                  <p className="text-sm text-muted-foreground relative z-10">BOCRA verifies accuracy and ensures applicant can function as a registrar. BOCRA will contact you if clarification is needed.</p>
                </div>
                <div className="bg-slate-50 dark:bg-muted/10 p-6 rounded-xl border relative">
                  <div className="absolute top-4 right-4 text-4xl font-black text-slate-200 dark:text-slate-800">6</div>
                  <h4 className="font-bold mb-2">Withdrawal option</h4>
                  <p className="text-sm text-muted-foreground relative z-10">You may withdraw at any time via email without prejudice to future applications.</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button className="bg-bocra-green hover:bg-bocra-green/90 text-bocra-navy font-bold px-8">Submit Application</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Policies & Agreements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Domain Name Dispute Resolution Procedure", desc: "Procedure for resolving .bw domain disputes." },
                { title: "Domain Name Dispute Resolution Policy", desc: "Core policy governing .bw domain disputes." },
                { title: ".BW Registration Terms and Conditions", desc: "Binds the Registrant to ccTLD policies and resolution services." },
                { title: "Acceptable Use Policy (AUP)", desc: "Actions prohibited to Users of the .bw Registry." },
                { title: "Registrar Accreditation Agreement (RAA)", desc: "Agreement between BOCRA and any potential Registrar." },
                { title: "WHOIS Policy", desc: "Outlines public access to .bw domain name register information." },
                { title: "Domain Life Cycle Policy (DLP)", desc: "Policy on registration, renewal, transfer, expiry and deletion." },
              ].map((policy, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-xl bg-card hover:border-bocra-green transition-colors cursor-pointer group">
                  <div className="p-3 bg-muted rounded-lg group-hover:bg-bocra-green/10 transition-colors">
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-bocra-green" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-bocra-green transition-colors">{policy.title}</h4>
                    <p className="text-xs text-muted-foreground">{policy.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
