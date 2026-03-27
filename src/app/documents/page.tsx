"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Book,
  Scale,
  Shield,
  Radio,
  Globe,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  category: string;
  downloadUrl: string;
  year: string;
  type: "pdf" | "doc" | "xlsx";
}

const documents: Document[] = [
  { id: "1", name: "Universal Access and Service Fund Framework - September 2025", category: "UASF", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "2", name: "UASF Annual Report 2024/2025", category: "UASF", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "3", name: "State of ICTs In Botswana", category: "Reports", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "4", name: "Digital Services Act, 2025", category: "Legislation", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "5", name: "Cybersecurity Act, 2025", category: "Legislation", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "6", name: "Information Communication Technologies Quality of Service and Quality of Experience Guidelines", category: "Guidelines", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "7", name: "Baseline Security Requirements for Services Providers", category: "Cybersecurity", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "8", name: "Website Application Security Guidelines", category: "Cybersecurity", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "9", name: "BOCRA 2025 Annual Report", category: "Reports", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "10", name: "USAF Annual Report 2024", category: "UASF", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "11", name: "Cybersecurity Bill, 2025", category: "Legislation", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "12", name: "Digital Services Bill, 2025", category: "Legislation", downloadUrl: "#", year: "2025", type: "pdf" },
  { id: "13", name: "Numbering Plan and List of Numbering Resource Allocations and Assignments", category: "Technical", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "14", name: "Know your Customer (KYC) Form", category: "Forms", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "15", name: "BOCRA Electromagnetic Fields Exposure Guidelines", category: "Guidelines", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "16", name: "BOCRA Type Approval Guidelines 2023", category: "Guidelines", downloadUrl: "#", year: "2023", type: "pdf" },
  { id: "17", name: "BOCRA 2024 Annual Report", category: "Reports", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "18", name: "UASF Youth Hackathon", category: "UASF", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "19", name: "BOCRA Discussion Paper Local Content Guidelines 2024 (DRAFT)", category: "Guidelines", downloadUrl: "#", year: "2024", type: "pdf" },
  { id: "20", name: "Broadcasting Code 2023", category: "Broadcasting", downloadUrl: "#", year: "2023", type: "pdf" },
  { id: "21", name: "Postal Services Regulations 2023", category: "Postal", downloadUrl: "#", year: "2023", type: "pdf" },
  { id: "22", name: "Spectrum Management Framework", category: "Technical", downloadUrl: "#", year: "2023", type: "pdf" },
  { id: "23", name: "Consumer Protection Guidelines", category: "Guidelines", downloadUrl: "#", year: "2023", type: "pdf" },
  { id: "24", name: "Licensing Framework for Telecommunications", category: "Licensing", downloadUrl: "#", year: "2023", type: "pdf" },
];

const categories = [
  { value: "all", label: "All Categories", icon: FileText },
  { value: "Legislation", label: "Legislation", icon: Scale },
  { value: "Guidelines", label: "Guidelines", icon: Book },
  { value: "Reports", label: "Reports", icon: FileText },
  { value: "UASF", label: "UASF", icon: Globe },
  { value: "Cybersecurity", label: "Cybersecurity", icon: Shield },
  { value: "Technical", label: "Technical", icon: Radio },
  { value: "Broadcasting", label: "Broadcasting", icon: Radio },
  { value: "Licensing", label: "Licensing", icon: FileText },
  { value: "Forms", label: "Forms", icon: FileText },
  { value: "Postal", label: "Postal", icon: FileText },
];

const ITEMS_PER_PAGE = 10;

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Legislation: "bg-bocra-blue/10 text-bocra-blue border-bocra-blue/30",
    Guidelines: "bg-bocra-green/10 text-bocra-green border-bocra-green/30",
    Reports: "bg-bocra-yellow/10 text-bocra-yellow border-bocra-yellow/30",
    UASF: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
    Cybersecurity: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
    Technical: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
    Broadcasting: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
    Licensing: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200",
    Forms: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200",
    Postal: "bg-bocra-red/10 text-bocra-red border-bocra-red/30",
  };
  return colors[category] || "bg-slate-100 text-slate-600 border-slate-200";
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value ?? "all");
    setCurrentPage(1);
  };

  const handleSearch = (value: string | null) => {
    setSearchQuery(value ?? "");
    setCurrentPage(1);
  };

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden border-t-4 border-bocra-green">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0 block"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-bocra-green/20 to-transparent z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-bocra-green/20 text-bocra-green hover:bg-bocra-green/30 mb-6 font-semibold border-none">
            Resource Library
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Documents & Legislation
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Access official BOCRA publications, regulatory frameworks,
            guidelines, and legislation governing Botswana&apos;s communications
            sector.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-2xl font-bold text-bocra-green">
                {documents.length}
              </span>
              <span className="text-white/70 text-sm ml-2">Documents</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-2xl font-bold text-bocra-yellow">
                {categories.length - 1}
              </span>
              <span className="text-white/70 text-sm ml-2">Categories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <Card className="bg-white dark:bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          <CardContent className="p-6 md:p-10">
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-[200px] bg-slate-50 dark:bg-muted/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4" />
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative max-w-sm w-full">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-muted/30"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Documents table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-muted/30">
                    <TableHead className="font-semibold w-[60%]">
                      Document Name
                    </TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold text-center">
                      Download
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                        <p className="font-medium">No documents found</p>
                        <p className="text-sm">
                          Try adjusting your search or filter criteria
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDocuments.map((doc) => (
                      <TableRow
                        key={doc.id}
                        className="hover:bg-slate-50 dark:hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground leading-snug">
                                {doc.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Published: {doc.year}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getCategoryColor(doc.category)}
                          >
                            {doc.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <a
                            href={doc.downloadUrl}
                            download
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 h-7 text-[0.8rem] font-medium text-bocra-blue hover:text-bocra-blue-light hover:bg-bocra-blue/10 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredDocuments.length)}{" "}
                  of {filteredDocuments.length} documents
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={
                            currentPage === pageNum
                              ? "bg-bocra-blue hover:bg-bocra-blue-light text-white"
                              : ""
                          }
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick category links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {categories
            .filter((c) => c.value !== "all")
            .slice(0, 4)
            .map((cat) => {
              const count = documents.filter(
                (d) => d.category === cat.value
              ).length;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                    selectedCategory === cat.value
                      ? "border-bocra-blue bg-bocra-blue/5 dark:bg-bocra-blue/10"
                      : "border-border/50 bg-white dark:bg-card hover:border-bocra-blue/50"
                  }`}
                >
                  <cat.icon
                    className={`w-6 h-6 mb-2 ${
                      selectedCategory === cat.value
                        ? "text-bocra-blue"
                        : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-semibold text-foreground">{cat.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {count} document{count !== 1 ? "s" : ""}
                  </p>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
