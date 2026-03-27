"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { useLanguage } from "./language-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "bot" | "user";
  content: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  licence: "BOCRA issues 16+ licence types including PTO, Broadcasting, Amateur Radio, VANS, and more. Visit our Licensing Portal to start your application or check the status of an existing one.",
  license: "BOCRA issues 16+ licence types including PTO, Broadcasting, Amateur Radio, VANS, and more. Visit our Licensing Portal to start your application or check the status of an existing one.",
  complaint: "To file a complaint: 1) First contact your service provider directly. 2) Gather evidence (contracts, bills, correspondence). 3) File through our Complaints page. 4) BOCRA investigates if a prima facie CRA Act breach is established.",
  domain: "BOCRA manages the .bw country-code top-level domain. You can search, register, transfer, and renew .bw domains through our Domain Registry portal.",
  ".bw": "The .bw domain is Botswana's country-code top-level domain (ccTLD), managed by BOCRA. Visit our .BW Domain Registry to register your domain.",
  spectrum: "BOCRA manages Botswana's radio frequency spectrum. We allocate frequencies, issue radio licences, type-approve equipment, and prevent harmful interference.",
  cybersecurity: "BOCRA operates the Botswana Computer Incident Response Team (bwCIRT). We handle cyber incident response, publish advisories, and support the National Cybersecurity Strategy.",
  contact: "You can reach BOCRA at: Phone: +267 395-7755 | Fax: +267 396-7976 | Address: Plot No. 50671, Independence Avenue, Gaborone | Email: info@bocra.org.bw",
  about: "BOCRA (Botswana Communications Regulatory Authority) was established on 1 April 2013 under the CRA Act No. 19 of 2012. We regulate telecommunications, broadcasting, postal, internet, and radio sectors.",
  "quality of service": "BOCRA continuously monitors licensee service quality through our QoS Guidelines. View real-time metrics on our Dashboard page.",
  help: "I can help you with:\n• Licensing information\n• Filing complaints\n• .BW domain registration\n• Cybersecurity advisories\n• Spectrum management\n• Contact information\n\nJust type your question!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return "Thank you for your question. For specific inquiries, please contact BOCRA directly at +267 395-7755 or info@bocra.org.bw. You can also try asking about: licences, complaints, .bw domains, cybersecurity, or spectrum management.";
}

export function Chatbot() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: t("chatbot_welcome"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Re-initialize first message when language changes
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0 && newMsgs[0].role === 'bot' && (newMsgs[0].content.startsWith("Hello") || newMsgs[0].content.startsWith("Dumela"))) {
        newMsgs[0].content = t("chatbot_welcome");
      }
      return newMsgs;
    });
  }, [t]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = { role: "bot", content: getBotResponse(input) };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-bocra-blue hover:bg-bocra-blue-light animate-pulse-glow"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-bocra-navy rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in-up flex flex-col h-[500px]">
          {/* Header */}
          <div className="hero-gradient px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bocra-blue rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                  BOCRA Assistant <Sparkles className="w-3 h-3 text-bocra-yellow" />
                </h3>
                <p className="text-white/70 text-[10px] uppercase tracking-wider font-semibold">Online · AI Powered</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div ref={scrollRef} className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback className="bg-bocra-green/10 text-bocra-green">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-bocra-blue text-white rounded-br-none"
                        : "bg-white dark:bg-card border border-border/50 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarFallback className="bg-bocra-yellow/10 text-bocra-yellow font-bold text-[10px]">
                        ME
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback className="bg-bocra-green/10 text-bocra-green">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-card border border-border/50 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm">
                    <div className="flex gap-1 py-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-white dark:bg-bocra-navy">
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="pr-12 h-11 rounded-xl border-border/50 focus-visible:ring-bocra-blue"
              />
              <Button
                onClick={handleSend}
                size="sm"
                className="absolute right-1 top-1 bottom-1 h-9 w-9 p-0 bg-bocra-blue hover:bg-bocra-blue-light text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={!input.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-tight font-medium opacity-60">
              BOCRA Virtual Assistant v2.0
            </p>
          </div>
        </div>
      )}
    </>
  );
}
