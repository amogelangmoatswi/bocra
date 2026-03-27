import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Settings, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ManageDomainsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/domains/manage");

  const supabase = await createServerSupabaseClient();
  const { data: myDomains, error } = await supabase
    .from("domain_registrations")
    .select("*")
    .eq("user_id", (session.user as any).id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching domains:", error);
  }

  const items = myDomains || [];

  return (
    <div className="pb-24">
      <div className="bg-bocra-navy pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-white animate-fade-in-up">
          <Badge className="bg-bocra-green/20 text-bocra-green border-none mb-4">Registry Portal</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Manage My Domains</h1>
          <p className="text-white/80 max-w-2xl">View your registered .bw domains, check their statuses, and manage renewals from one dashboard.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-xl border-border/50 animate-fade-in-up delay-100">
          <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-muted/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Domains</CardTitle>
                <CardDescription>You have {items.length} registered domain{items.length !== 1 ? 's' : ''}.</CardDescription>
              </div>
              <Link href="/domains">
                <Button className="bg-bocra-blue hover:bg-bocra-blue-light text-white">Register New</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground mb-2">No domains found</h3>
                <p className="mb-6">You haven't registered any .bw domains yet.</p>
                <Link href="/domains">
                  <Button variant="outline">Search Domains</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((domain) => (
                  <div key={domain.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-muted/10 transition-colors group">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-lg bg-bocra-blue/10 flex items-center justify-center shrink-0 group-hover:bg-bocra-blue group-hover:text-white transition-colors">
                        <Globe className="w-6 h-6 text-bocra-blue group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-bocra-navy dark:text-white mb-1">{domain.domain_name}</h4>
                        <p className="text-xs text-muted-foreground">Registered: {new Date(domain.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                      <Badge className={
                        domain.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-red-100 text-red-800 hover:bg-red-100'
                      }>
                        {domain.status.toUpperCase()}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" disabled={domain.status !== 'active'}>
                          <Settings className="w-4 h-4" /> Manage DNS
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" disabled={domain.status !== 'active'}>
                          <CreditCard className="w-4 h-4" /> Renew
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
