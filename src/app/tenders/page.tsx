"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Calendar,
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";

interface Tender {
  id: string;
  name: string;
  documentName: string;
  documentUrl: string;
  documentSize: string;
  closingDate: string;
  status: "open" | "closed" | "adjudicated";
  category: "general" | "uasf";
}

const tenders: Tender[] = [
  {
    id: "1",
    name: "NOTICE OF ADJUDICATION DECISION - Supply and Installation of Solar Photovoltaic Panel System at BOCRA Head Office and Phakalane Spectrum House",
    documentName: "Notice_of_Adjudication_Decision[84].docx_.pdf",
    documentUrl: "#",
    documentSize: "429.57 KB",
    closingDate: "2026-03-27",
    status: "adjudicated",
    category: "general",
  },
  {
    id: "2",
    name: "Tender Opening Results - Provision of Insurance Brokerage Services to the Botswana Communications Regulatory Authority (BOCRA) Group",
    documentName: "Provision_of_Insurance_Brokerage_Services_for_BOCRA_Group_-_Technical_Evaluation_Results.pdf",
    documentUrl: "#",
    documentSize: "170.98 KB",
    closingDate: "2026-04-10",
    status: "open",
    category: "general",
  },
  {
    id: "3",
    name: "Consultancy Services for the Development of Cost Models and Pricing Framework for ICT Services to Enhance Competition among Operations in Botswana",
    documentName: "UASF_Cost_Models_RFP.pdf",
    documentUrl: "#",
    documentSize: "1.2 MB",
    closingDate: "2026-05-15",
    status: "open",
    category: "uasf",
  },
  {
    id: "4",
    name: "Consultancy Services for a Market Study and the Development of a Licensing Framework for the Postal Sector in Botswana",
    documentName: "Postal_Sector_Licensing_Framework_RFP.pdf",
    documentUrl: "#",
    documentSize: "890 KB",
    closingDate: "2026-05-20",
    status: "open",
    category: "uasf",
  },
  {
    id: "5",
    name: "Review of Type Approval Technical Standards & Procedures and Development of Broadcasting Technical Standards",
    documentName: "Type_Approval_Standards_Review_RFP.pdf",
    documentUrl: "#",
    documentSize: "1.5 MB",
    closingDate: "2026-04-30",
    status: "open",
    category: "uasf",
  },
];

const getStatusBadge = (status: Tender["status"]) => {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
          <Clock className="w-3 h-3 mr-1" /> Open
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          <CheckCircle className="w-3 h-3 mr-1" /> Closed
        </Badge>
      );
    case "adjudicated":
      return (
        <Badge className="bg-bocra-blue/10 text-bocra-blue dark:bg-bocra-blue/20 border-bocra-blue/30">
          <AlertCircle className="w-3 h-3 mr-1" /> Adjudicated
        </Badge>
      );
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDaysRemaining = (dateStr: string) => {
  const today = new Date();
  const deadline = new Date(dateStr);
  const diffTime = deadline.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return days;
};

export default function TendersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "uasf") return matchesSearch && tender.category === "uasf";
    if (activeTab === "open") return matchesSearch && tender.status === "open";
    return matchesSearch;
  });

  const openTenders = tenders.filter((t) => t.status === "open");
  const uasfTenders = tenders.filter((t) => t.category === "uasf");

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden border-t-4 border-bocra-yellow">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0 block"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-bocra-yellow/20 to-transparent z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-bocra-yellow/20 text-bocra-yellow hover:bg-bocra-yellow/30 mb-6 font-semibold border-none">
            Procurement
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tenders & Procurement
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            BOCRA is committed to ensuring best value-for-money through a
            transparent and thorough tendering process. Browse current and past
            tender opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-2xl font-bold text-bocra-yellow">
                {openTenders.length}
              </span>
              <span className="text-white/70 text-sm ml-2">Open Tenders</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-2xl font-bold text-bocra-green">
                {uasfTenders.length}
              </span>
              <span className="text-white/70 text-sm ml-2">UASF Projects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-10 mb-8">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="bg-slate-100 dark:bg-muted p-1">
                <TabsTrigger
                  value="all"
                  className="px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-bocra-navy data-[state=active]:shadow-sm"
                >
                  All Tenders
                </TabsTrigger>
                <TabsTrigger
                  value="open"
                  className="px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-bocra-navy data-[state=active]:shadow-sm"
                >
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="uasf"
                  className="px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-bocra-navy data-[state=active]:shadow-sm"
                >
                  UASF
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative max-w-sm w-full">
              <Input
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-muted/30"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Tenders table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-muted/30">
                  <TableHead className="font-semibold">Tender Name</TableHead>
                  <TableHead className="font-semibold">Document</TableHead>
                  <TableHead className="font-semibold">Closing Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p className="font-medium">No tenders found</p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTenders.map((tender) => {
                    const daysRemaining = getDaysRemaining(tender.closingDate);
                    return (
                      <TableRow
                        key={tender.id}
                        className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="max-w-md">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground leading-snug">
                              {tender.name}
                            </p>
                            {tender.category === "uasf" && (
                              <Badge
                                variant="outline"
                                className="text-xs text-bocra-green border-bocra-green/30"
                              >
                                UASF Project
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={tender.documentUrl}
                            className="flex items-center gap-2 text-bocra-blue hover:text-bocra-blue-light transition-colors group"
                          >
                            <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                              <FileText className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {tender.documentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tender.documentSize}
                              </p>
                            </div>
                            <Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {formatDate(tender.closingDate)}
                            </p>
                            {tender.status === "open" && daysRemaining > 0 && (
                              <p
                                className={`text-xs ${
                                  daysRemaining <= 7
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {daysRemaining} days remaining
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tender.status)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Information cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="bg-slate-50 dark:bg-muted/30 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-bocra-blue" /> Tendering Process
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                In order to ensure that the Botswana Communications Regulatory
                Authority is offered the best value-for-money, it has a thorough
                tendering process.
              </p>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">
                  Tendering Documents Include:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Introduction</strong>{" "}
                      - Background information on the tender
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Tender Conditions
                      </strong>{" "}
                      - Legal parameters surrounding the tender
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Specification</strong>{" "}
                      - Description of supplies, service or works
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Instructions for Tender Submission
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Qualitative Tender Response
                      </strong>{" "}
                      - Questions to be answered
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Pricing and Delivery Schedule
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">Form of Tender</strong>{" "}
                      - Declaration to be signed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Certificate of Non-Collusion
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-bocra-blue mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Draft of Proposed Contract
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-md">
            <CardHeader className="bg-bocra-green/10 dark:bg-bocra-green/20 border-b border-bocra-green/20">
              <CardTitle className="text-lg flex items-center gap-2 text-bocra-green">
                <FileText className="w-5 h-5" /> Universal Access Service Fund
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The Universal Access and Service Fund (UASF) is dedicated to
                expanding ICT infrastructure and services to underserved areas
                in Botswana. Current UASF tender opportunities include:
              </p>
              <div className="space-y-3">
                {uasfTenders.map((tender) => (
                  <div
                    key={tender.id}
                    className="p-4 rounded-lg bg-bocra-green/5 dark:bg-bocra-green/10 border border-bocra-green/20"
                  >
                    <p className="font-medium text-sm text-foreground mb-2">
                      {tender.name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Closes: {formatDate(tender.closingDate)}
                      </span>
                      {getStatusBadge(tender.status)}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-bocra-green hover:bg-bocra-green/90 text-white mt-4">
                View All UASF Tenders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
