"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Radio,
  Wifi,
  Shield,
  Phone,
  FileText,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Can I Use The Frequency Allocated Throughout The Country (Can I Use The Frequency Allocated For Geographical Area A At Area B)?",
    answer: "Radio licenses are issued per geographical (40 km) location unless advised otherwise. If you need to change location, you must submit an application requesting for reuse of the same frequency in another area. If the frequency is not used in the area that you want to use it, you may be authorized to use it. Note that the frequency allocated for one location is strictly for that area and may not be reused in another area without the consent of BOCRA.",
    category: "Radio Licensing",
  },
  {
    id: "2",
    question: "Can I Buy Radios For Personal Use From Outside The Country?",
    answer: "BOCRA encourages customers to buy radio equipment from local, recognized radio dealers for the simple reason that if they are faulty you can always take them back for repair and to also ensure that if they are not programmed properly or need to be deprogrammed you can always have them done locally by your dealer. Note that it is illegal to enter the country with radio equipment that has not been licensed, unless on the expressed authority from BOCRA.",
    category: "Radio Licensing",
  },
  {
    id: "3",
    question: "Do I Have To Type Approve Equipment That Is Already Type Approved?",
    answer: "Type approval of radio equipment has to be done on every equipment that comes into the market, unless if the equipment has been type approved with BOCRA by the manufacturer on behalf of the distributor. BOCRA also wants to satisfy itself that the equipment indeed complies with the standards and technical information that has been provided on the previous application. Note that any variation on the software will require a new type approval.",
    category: "Type Approval",
  },
  {
    id: "4",
    question: "How Does A Radio Dealer Assist In Acquiring A Radio License?",
    answer: "A radio dealer is a company that has the expertise of maintaining radio equipment. It is a company that sells radios, repairs those radios as well as programs radios to the allocated frequency or deprograms them once they are no longer in use. It is a company that understands the impact that radio equipment may have on human health and the importance of tuning the radios to the allocated frequency.",
    category: "Radio Licensing",
  },
  {
    id: "5",
    question: "What Are The Requirements To Have Equipment Type Approved?",
    answer: "For type approval of equipment, one needs to fill a type approval form indicating their business, technical specification of the equipment that they want type approved, type approval certificate from region 1 (Africa and Europe or any recognized regulator), and a declaration of conformity from the manufacturer. Note: for type approval one has to have a repair centre locally or a local office where those equipment may be taken for repair even though they may be importing the equipment from outside.",
    category: "Type Approval",
  },
  {
    id: "6",
    question: "What Are The Requirements To Sell And Maintain Radio Equipment And How Do You Go About Getting The License?",
    answer: "In order to repair or distribute (sell) radio equipment, you require a Radio Dealers license. This license can be obtained from BOCRA after clearly demonstrating that you have the expertise to work with radio equipment, that you have test equipment that you can use to test and tune those radios to the allocated frequency, and that financially you can sustain the business. Refer to requirements to have a dealer's license.",
    category: "Radio Licensing",
  },
  {
    id: "7",
    question: "How Do I Go About Disposing Radios That I Do Not Need?",
    answer: "To dispose of radio equipment, the following steps should be followed: A company wishing to dispose of their radio equipment must write to BOCRA indicating what they intend doing with their radios which they no longer require. Secondly, depending on the status of the radio (still serviceable or unusable) they may take them to a radio dealer who will remove the frequency from the radios (deprogramming), and if they can no longer be used will prepare a boarding certificate. Those that are still in good working condition, once deprogrammed may be sold to a licensed radio operator or the company taking them over must be willing to license them, or may take them to the auctioneers for disposal. Note: if you have radios they must be licensed according to the Telecommunication Act whether in use or not.",
    category: "Radio Licensing",
  },
  {
    id: "8",
    question: "How Long Does It Take To Have A Radio License?",
    answer: "Normally it should take a maximum of three working days subject to availability of the required information submitted by the applicant.",
    category: "Radio Licensing",
  },
  {
    id: "9",
    question: "What Are The Requirements To Have A Radio License?",
    answer: "For one to get a radio license, one needs to fill a form called frequency application form which is found under BOCRA website (www.bocra.org.bw) under the heading applications, clearly indicating the type of service they are running and areas of operations. A copy of company registration should accompany the application form. A second form called license renewal must also be filled giving the details of the equipment that are going to be used (serial numbers, make and model of the radio equipment).",
    category: "Radio Licensing",
  },
  {
    id: "10",
    question: "How Do I Go About Getting A Radio License To Operate A Cab Company?",
    answer: "For one to get a cab license or a radio license, one needs to fill a form called frequency application form which is found under BOCRA website (www.bocra.org.bw) under the heading applications, clearly indicating the type of service they are running and areas of operations. A copy of company registration should accompany the application form. A second form called license renewal must also be filled giving the details of the equipment that are going to be used (serial numbers, make and model of the radio equipment).",
    category: "Radio Licensing",
  },
  {
    id: "11",
    question: "How Can I Obtain More Information On Growth Trends Of Certain Telecommunication Services In Botswana?",
    answer: "BOCRA publishes growth trends of various telecommunication market segments on its website. You can also contact BOCRA directly for more detailed information.",
    category: "General",
  },
  {
    id: "12",
    question: "What Are Value-Added Networks (VANs)?",
    answer: "Value-Added Networks (VANs) provide additional functions to increase the value of basic telecommunication services and infrastructure upon which they were built.",
    category: "Telecommunications",
  },
  {
    id: "13",
    question: "Who Do I Complain To If The Service Of One Of The Providers Is Bad?",
    answer: "To complain to BOCRA you must first contact or complain to your service provider and if all the channels are exhausted, contact the Consumer Affairs Manager or Compliance Department at 395 7755.",
    category: "Complaints",
  },
  {
    id: "14",
    question: "What Are The Fees For Licence For An Internet Service Provider, Data Service Provider And Private Network Licences?",
    answer: "The licence fees for these are P10,000.00 initial fee (once-off fee) and P3,000.00 for annual fee. Both fees attract Value Added Tax (VAT).",
    category: "Licensing Fees",
  },
  {
    id: "15",
    question: "How Can I Get The Licence For My Citizen Band Radio Station?",
    answer: "You can get the application forms from BOCRA. Visit our website or contact our offices to obtain the necessary forms and guidance on the application process.",
    category: "Radio Licensing",
  },
];

const categories = [
  { value: "all", label: "All Topics", icon: HelpCircle },
  { value: "Radio Licensing", label: "Radio Licensing", icon: Radio },
  { value: "Type Approval", label: "Type Approval", icon: Shield },
  { value: "Telecommunications", label: "Telecommunications", icon: Wifi },
  { value: "Complaints", label: "Complaints", icon: MessageSquare },
  { value: "Licensing Fees", label: "Licensing Fees", icon: FileText },
  { value: "General", label: "General", icon: HelpCircle },
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    faqs.forEach((faq) => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="pb-24">
      {/* Header section */}
      <div className="bg-bocra-navy pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 relative overflow-hidden border-t-4 border-bocra-blue">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] z-0 block"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-bocra-blue/20 to-transparent z-0"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <Badge className="bg-bocra-blue/20 text-bocra-sky hover:bg-bocra-blue/30 mb-6 font-semibold border-none">
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Find answers to common questions about radio licensing, type
            approval, telecommunications services, and more.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white dark:bg-card border-0 shadow-xl"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-md sticky top-28">
              <CardHeader className="bg-slate-50 dark:bg-muted/30 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-bocra-blue" /> Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {categories.map((cat) => {
                    const count =
                      cat.value === "all"
                        ? faqs.length
                        : categoryCounts[cat.value] || 0;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                          selectedCategory === cat.value
                            ? "bg-bocra-blue/10 text-bocra-blue dark:text-bocra-sky"
                            : "hover:bg-slate-50 dark:hover:bg-muted/30 text-foreground/70"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            selectedCategory === cat.value
                              ? "bg-bocra-blue/20 text-bocra-blue"
                              : ""
                          }`}
                        >
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - FAQs */}
          <div className="lg:col-span-3">
            <Card className="border-border/50 shadow-xl">
              <CardContent className="p-6 md:p-8">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-16">
                    <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-bold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-6">
                      We couldn&apos;t find any FAQs matching your search. Try
                      different keywords or browse by category.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-muted-foreground">
                        Showing {filteredFaqs.length} question
                        {filteredFaqs.length !== 1 ? "s" : ""}
                        {selectedCategory !== "all" && (
                          <span>
                            {" "}
                            in{" "}
                            <Badge
                              variant="outline"
                              className="ml-1 text-xs"
                            >
                              {selectedCategory}
                            </Badge>
                          </span>
                        )}
                      </p>
                    </div>

                    <Accordion multiple={false} className="space-y-4">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border border-border/50 rounded-xl px-6 data-[state=open]:border-bocra-blue/50 data-[state=open]:shadow-md transition-all animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <AccordionTrigger className="text-left py-5 hover:no-underline group">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-bocra-blue/10 flex items-center justify-center flex-shrink-0 group-data-[state=open]:bg-bocra-blue group-data-[state=open]:text-white transition-colors">
                                <span className="text-sm font-bold">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-semibold text-foreground pr-4 leading-snug">
                                  {faq.question}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {faq.category}
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 pl-12">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="mt-8 border-bocra-blue/30 bg-gradient-to-br from-bocra-blue/5 to-bocra-sky/10 dark:from-bocra-blue/10 dark:to-bocra-sky/5">
              <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-bocra-blue/10 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-bocra-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground">
                      Our team is here to help. Contact us for personalized
                      assistance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/contact">
                    <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white">
                      Contact Us <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/complaints">
                    <Button variant="outline">File a Complaint</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
