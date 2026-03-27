import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Radio,
  Mail,
  Wifi,
  Activity,
  ShieldCheck,
  Globe,
  Lock,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Core Services | BOCRA",
  description: "Explore the core regulatory services provided by BOCRA across telecommunications, broadcasting, postal, internet, spectrum, type approval, and domain management.",
};

const SERVICES = [
  {
    id: "telecoms",
    title: "Telecommunications Regulation",
    description: "Regulating local, national, international, and mobile voice and data services. Overseeing PTOs like BTC, Mascom, and Orange Botswana.",
    icon: Smartphone,
    color: "bg-bocra-blue/10 text-bocra-blue",
    features: ["Quality of Service enforcement", "National Numbering Plan management", "Price regulation", "Competition monitoring"],
    link: "/services#telecoms",
  },
  {
    id: "broadcasting",
    title: "Broadcasting Regulation",
    description: "Licensing and overseeing commercial radio and television broadcasting services in Botswana.",
    icon: Radio,
    color: "bg-bocra-yellow/10 text-bocra-yellow",
    features: ["TV and Radio licensing", "Content Service Provider oversight", "Audience surveys", "Technical standards enforcement"],
    link: "/services#broadcasting",
  },
  {
    id: "postal",
    title: "Postal Services Regulation",
    description: "Ensuring safe, reliable, efficient, and affordable postal and courier services nationwide.",
    icon: Mail,
    color: "bg-bocra-red/10 text-bocra-red",
    features: ["Designated Postal Operator (DPO) licensing", "Commercial courier licensing", "Universal service obligations", "Postal Sector Licensing Framework"],
    link: "/services#postal",
  },
  {
    id: "internet",
    title: "Internet & ICT Regulation",
    description: "Oversight of broadband deployment, internet service providers, and the National Broadband Strategy.",
    icon: Wifi,
    color: "bg-bocra-green/10 text-bocra-green",
    features: ["ISP and VANS licensing", "Minimum Broadband Internet Requirements", "ICT infrastructure monitoring", "Electronic communications transactions"],
    link: "/services#internet",
  },
  {
    id: "spectrum",
    title: "Radio Spectrum Management",
    description: "Managing Botswana's finite radio frequency spectrum through transparent allocation and licensing.",
    icon: Activity,
    color: "bg-bocra-yellow/10 text-bocra-yellow",
    features: ["National Radio Frequency Plan", "Frequency allocations", "Interference prevention", "Amateur and Citizens Band licensing"],
    link: "/services#spectrum",
  },
  {
    id: "type-approval",
    title: "Type Approval of Equipment",
    description: "Certifying all communications equipment connected to or used within Botswana's networks.",
    icon: ShieldCheck,
    color: "bg-bocra-blue/10 text-bocra-blue",
    features: ["Radio equipment testing", "Terminal equipment certification", "Consumer protection from hazardous devices", "ITU Region 1 standard compliance"],
    link: "/services#type-approval",
  },
  {
    id: "domain",
    title: ".BW Domain Registry",
    description: "Management of the .bw country-code top-level domain (ccTLD) as a secure national resource.",
    icon: Globe,
    color: "bg-bocra-green/10 text-bocra-green",
    features: ["Registration and administration", "Second-level domains", "WHOIS services", "DNS security and stability"],
    link: "/domains",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity (bwCIRT)",
    description: "Operating the Botswana Computer Incident Response Team to protect national communications infrastructure.",
    icon: Lock,
    color: "bg-bocra-red/10 text-bocra-red",
    features: ["National cyber incident response", "Cybersecurity Strategy implementation", "Advisory services", "Take-down notices administration"],
    link: "/cybersecurity",
  },
];

export default function ServicesPage() {
  return (
    <div className="pb-24">
      {/* Hero with sector strip */}
      <div className="relative bg-bocra-navy pt-24 pb-20 lg:pt-32 lg:pb-24 px-4 text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bocra-yellow/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-bocra-green/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/3"></div>

        <div className="max-w-3xl mx-auto animate-fade-in-up relative z-10">
          {/* Sector indicator pills */}
          <div className="flex justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bocra-blue-light"></span> Telecoms
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bocra-yellow"></span> Broadcasting
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bocra-green"></span> Internet
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-bocra-red"></span> Postal
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Core Regulatory Services
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Discover the full scope of BOCRA&apos;s mandate across eight core service areas designed
            to foster a connected and digitally driven Botswana.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            /* Map the colour class to get the border-top colour */
            const borderTop = service.color.includes("bocra-blue") ? "border-t-bocra-blue"
              : service.color.includes("bocra-yellow") ? "border-t-bocra-yellow"
              : service.color.includes("bocra-green") ? "border-t-bocra-green"
              : "border-t-bocra-red";
            const bulletColor = service.color.includes("bocra-blue") ? "bg-bocra-blue"
              : service.color.includes("bocra-yellow") ? "bg-bocra-yellow"
              : service.color.includes("bocra-green") ? "bg-bocra-green"
              : "bg-bocra-red";
            return (
              <Card key={service.id} id={service.id} className={`h-full flex flex-col group hover:shadow-lg transition-all duration-300 border-border/50 scroll-mt-24 border-t-4 ${borderTop}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${service.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-bocra-blue transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between mt-auto">
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${bulletColor} mt-1.5 flex-shrink-0`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={service.link} className="w-full mt-auto">
                    <Button variant="outline" className="w-full justify-between hover:bg-bocra-blue hover:text-white hover:border-bocra-blue transition-all">
                      Access Service
                      <ChevronRight className="w-4 h-4 ml-2 mt-0.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
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
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply for a Licence?</h2>
              <p className="text-white/80 mb-8">
                Explore our comprehensive Licensing Framework, introduced in 2015 to embrace
                convergence, technology neutrality, and ease of market entry.
              </p>
              <Link href="/licensing">
                <Button size="lg" className="bg-bocra-yellow hover:bg-bocra-yellow-light text-bocra-navy font-semibold text-lg px-8 shadow-xl">
                  Visit Licensing Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

