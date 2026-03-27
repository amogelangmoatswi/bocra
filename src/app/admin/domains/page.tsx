import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { updateDomainStatus } from "@/app/domains/actions";

export default async function AdminDomainsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login");
  }
  const supabase = await createServerSupabaseClient();
  
  // Fetch domains with user info
  const { data: domains, error } = await supabase
    .from("domain_registrations")
    .select(`
      *,
      profiles:user_id ( full_name, email, phone )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching domains:", error);
  }

  const items = domains || [];
  
  // Stats
  const total = items.length;
  const active = items.filter(i => i.status === "active").length;
  const pending = items.filter(i => i.status === "pending").length;
  const expired = items.filter(i => i.status === "expired" || i.status === "suspended").length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Domain Registry Management</h1>
          <p className="text-muted-foreground">Manage .bw domain registrations and statuses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Domains</p>
                <h3 className="text-3xl font-bold">{total}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active</p>
                <h3 className="text-3xl font-bold">{active}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
                <h3 className="text-3xl font-bold">{pending}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Suspended/Expired</p>
                <h3 className="text-3xl font-bold">{expired}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Registered Domains</CardTitle>
          <CardDescription>Update status to activate newly purchased domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Domain & Date</TableHead>
                  <TableHead>Registrant</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No domains found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((dmn) => (
                    <TableRow key={dmn.id} className="hover:bg-muted/50 transition-colors group">
                      <TableCell className="align-top">
                        <div className="font-bold text-lg text-bocra-blue">{dmn.domain_name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(dmn.created_at).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="font-medium">{dmn.profiles?.full_name || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground mt-1">{dmn.profiles?.email}</div>
                        <div className="text-xs text-muted-foreground">{dmn.profiles?.phone || "No phone"}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <form action={async (formData) => {
                          "use server";
                          const status = formData.get("status") as string;
                          if (status) await updateDomainStatus(dmn.id, status);
                        }}>
                          <Select defaultValue={dmn.status} name="status">
                            <SelectTrigger className="w-[160px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending Payment</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                          <button type="submit" className="hidden" id={`submit-${dmn.id}`}></button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
