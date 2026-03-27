import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Users, Zap, CheckCircle2, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | BOCRA",
  description: "Learn about the Botswana Communications Regulatory Authority's history, mission, vision, and strategic pillars.",
};

const VALUES = [
  {
    title: "Excellence",
    description: "Strive to be a world-class leader in regulatory services through committed teams and impeccable customer service.",
    icon: Shield,
    color: "text-bocra-blue bg-bocra-blue/10",
  },
  {
    title: "Proactiveness",
    description: "Forward-looking in the delivery of services and anticipating sector trends.",
    icon: Zap,
    color: "text-bocra-yellow bg-bocra-yellow/10",
  },
  {
    title: "Integrity",
    description: "Openness, honesty, and accountability in all regulatory decisions.",
    icon: CheckCircle2,
    color: "text-bocra-green bg-bocra-green/10",
  },
  {
    title: "People",
    description: "Harnessing individual skills and strengths to drive collective success.",
    icon: Users,
    color: "text-bocra-red bg-bocra-red/10",
  },
];

const PILLARS = [
  "Regulatory Excellence",
  "Digital Transformation",
  "Consumer Protection",
  "Universal Access",
  "Innovation Enablement",
  "Stakeholder Engagement",
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 text-center relative overflow-hidden border-t-4 border-t-bocra-blue">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bocra-blue-light via-bocra-navy to-bocra-navy"></div>
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Who Is BOCRA?
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Leading Botswana towards a connected and digitally driven society through
            independent, converged communications regulation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Organization Overview */}
        <Card className="shadow-lg border-border/50 mb-16 animate-fade-in-up delay-100">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bocra-blue/10 text-bocra-blue dark:text-bocra-yellow text-sm font-semibold mb-6">
                  <Building2 className="w-4 h-4" />
                  Established April 2013
                </div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our History & Mandate</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The Botswana Communications Regulatory Authority (BOCRA) is Botswana's independent,
                    converged communications regulator. We were established on 1 April 2013 under the
                    Communications Regulatory Authority Act, 2012 (CRA Act No. 19 of 2012).
                  </p>
                  <p>
                    BOCRA replaced two previously separate bodies — the Botswana Telecommunications
                    Authority (BTA) and the broadcasting regulator — creating a single integrated authority
                    for the entire communications sector.
                  </p>
                  <p>
                    As a statutory body, we operate independently of direct government control while
                    remaining accountable to Parliament and the Minister responsible for communications.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-muted/20 p-8 rounded-2xl border border-border/50">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Target className="text-bocra-green" /> Vision & Mission
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-bocra-blue dark:text-bocra-yellow uppercase tracking-wider text-sm mb-2">Our Vision</h4>
                    <p className="text-lg font-medium text-foreground">"A connected and Digitally Driven Society."</p>
                  </div>
                  <div className="h-px bg-border"></div>
                  <div>
                    <h4 className="font-semibold text-bocra-blue dark:text-bocra-yellow uppercase tracking-wider text-sm mb-2">Our Mission</h4>
                    <p className="text-muted-foreground">
                      "To regulate the Communications sector for the promotion of competition,
                      innovation, consumer protection and universal access."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide our regulatory decisions and daily operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-6 ${value.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Strategic Pillars */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Strategic Pillars (2024–2029)</h2>
            <p className="text-muted-foreground">The six strategic focus areas driving our mandate for the next five years.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {PILLARS.map((pillar, i) => (
              <div key={i} className="bg-white dark:bg-card border border-border/50 rounded-xl p-6 text-center hover:border-bocra-blue/30 hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors group cursor-default">
                <div className="text-3xl font-black text-bocra-blue/10 dark:text-white/5 group-hover:text-bocra-blue/20 dark:group-hover:text-bocra-yellow/20 transition-colors mb-2">0{i + 1}</div>
                <h3 className="font-bold text-foreground group-hover:text-bocra-blue dark:group-hover:text-bocra-yellow transition-colors">{pillar}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
