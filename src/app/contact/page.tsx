"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="pb-24">
      {/* Header section w/ map pattern */}
      <div className="bg-bocra-navy pt-24 pb-32 px-4 relative overflow-hidden border-t-4 border-bocra-yellow">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-bocra-navy to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6">
            Contact <span className="text-bocra-green">BOCRA</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Get in touch with our team for general inquiries, support, or to provide feedback on our services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-100">
            <Card className="bg-bocra-blue text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-8">Head Office</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-bocra-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 mb-1">Physical Address</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Plot No. 50671, Independence Avenue<br />
                        Gaborone, Botswana
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-bocra-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 mb-1">Postal Address</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Private Bag 00495<br />
                        Gaborone, Botswana
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-bocra-green" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 mb-1">Phone & Fax</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Tel: <a href="tel:+2673957755" className="hover:text-white transition-colors">+267 395-7755</a><br />
                        Fax: +267 396-7976
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-bocra-yellow-light" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 mb-1">Operating Hours</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Monday - Friday<br />
                        08:00 - 16:30
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-md animate-fade-in-up delay-200">
              <CardContent className="p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-bocra-blue" />
                  Specific Inquiries
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">General Info</span>
                    <a href="mailto:info@bocra.org.bw" className="font-medium text-bocra-blue hover:underline">info@bocra.org.bw</a>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Consumer Complaints</span>
                    <a href="mailto:consumer@bocra.org.bw" className="font-medium text-bocra-blue hover:underline">consumer@bocra.org.bw</a>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Type Approval</span>
                    <a href="mailto:typeapproval@bocra.org.bw" className="font-medium text-bocra-blue hover:underline">typeapproval@bocra.org.bw</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">bwCIRT (Cybersecurity)</span>
                    <a href="mailto:cirt@bocra.org.bw" className="font-medium text-red-600 hover:underline">cirt@bocra.org.bw</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-border/50 animate-fade-in-up delay-300 h-full">
              <CardHeader className="border-b border-border/50 bg-slate-50 dark:bg-muted/30 p-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-bocra-green/10 flex items-center justify-center">
                    <Send className="w-6 h-6 text-bocra-green" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription className="text-base mt-1">We typically reply within 1-2 business days.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-16 animate-fade-in">
                    <div className="w-20 h-20 bg-bocra-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-10 h-10 text-bocra-green" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">Message Sent!</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      Thank you for contacting BOCRA. Your message has been securely transmitted. A member of our team will be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-semibold">First Name *</Label>
                        <Input id="firstName" required className="h-12 bg-slate-50 dark:bg-muted/50" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-semibold">Last Name *</Label>
                        <Input id="lastName" required className="h-12 bg-slate-50 dark:bg-muted/50" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                        <Input id="email" type="email" required className="h-12 bg-slate-50 dark:bg-muted/50" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                        <Input id="phone" type="tel" className="h-12 bg-slate-50 dark:bg-muted/50" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-sm font-semibold">Inquiry Type *</Label>
                      <Select required>
                        <SelectTrigger id="subject" className="h-12 bg-slate-50 dark:bg-muted/50">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Information</SelectItem>
                          <SelectItem value="licensing">Licensing Queries</SelectItem>
                          <SelectItem value="domain">.BW Domain Names</SelectItem>
                          <SelectItem value="spectrum">Radio Spectrum</SelectItem>
                          <SelectItem value="equipment">Type Approval</SelectItem>
                          <SelectItem value="media">Media / PR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-semibold">Your Message *</Label>
                      <Textarea 
                        id="message" 
                        required 
                        className="min-h-[150px] bg-slate-50 dark:bg-muted/50 resize-y" 
                        placeholder="How can we help you today?"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground w-full sm:w-2/3">
                        By submitting this form, you agree that your data may be processed in accordance with the Botswana Data Protection Act 2024.
                      </p>
                      <Button type="submit" size="lg" className="w-full sm:w-auto bg-bocra-blue hover:bg-bocra-blue-light text-white px-8 h-12 shadow-lg">
                        Submit Message <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative animate-fade-in-up delay-400 group">
          {/* Abstract map representation */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-2xl flex items-center gap-4 group-hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-full bg-bocra-green/10 flex items-center justify-center animate-bounce">
                <MapPin className="w-6 h-6 text-bocra-green" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">BOCRA Headquarters</h3>
                <p className="text-sm text-muted-foreground">Plot No. 50671, Independence Avenue</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-bocra-blue">Get Directions</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
