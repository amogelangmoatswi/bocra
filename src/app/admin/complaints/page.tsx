import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Search, Filter, MessageSquare, Clock } from "lucide-react";
import { updateComplaintStatus } from "@/app/complaints/actions";

export default async function AdminComplaintsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login");
  }
  const supabase = await createServerSupabaseClient();
  
  // Fetch complaints with user info
  const { data: complaints, error } = await supabase
    .from("complaints")
    .select(`
      *,
      profiles:user_id ( full_name, email, phone )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching complaints:", error);
  }

  const items = complaints || [];
  
  // Stats
  const total = items.length;
  const submitted = items.filter(i => i.status === "submitted").length;
  const investigating = items.filter(i => i.status === "under_investigation").length;
  const resolvedOut = items.filter(i => i.status === "resolved").length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Consumer Complaints</h1>
          <p className="text-muted-foreground">Manage and track consumer dispute escalations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Cases</p>
                <h3 className="text-3xl font-bold">{total}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">New</p>
                <h3 className="text-3xl font-bold">{submitted}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Investigating</p>
                <h3 className="text-3xl font-bold">{investigating}</h3>
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
                <p className="text-sm font-medium text-muted-foreground mb-1">Resolved</p>
                <h3 className="text-3xl font-bold">{resolvedOut}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
          <CardDescription>Update status and notify consumers of progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Reference & Date</TableHead>
                  <TableHead>Consumer</TableHead>
                  <TableHead>Provider & Subject</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No complaints found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((cmp) => (
                    <TableRow key={cmp.id} className="hover:bg-muted/50 cursor-pointer transition-colors group">
                      <TableCell className="font-medium align-top">
                        <div className="font-semibold text-bocra-blue">{cmp.reference_number}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(cmp.created_at).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="font-medium">{cmp.profiles?.full_name || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cmp.profiles?.email}</div>
                        <div className="text-xs text-muted-foreground">{cmp.profiles?.phone || "No phone"}</div>
                      </TableCell>
                      <TableCell className="align-top max-w-[300px]">
                        <Badge variant="outline" className="mb-2 bg-slate-50">{cmp.provider.toUpperCase()}</Badge>
                        <div className="font-semibold text-sm truncate">{cmp.subject}</div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cmp.description}</p>
                      </TableCell>
                      <TableCell className="align-top">
                        <form action={async (formData) => {
                          "use server";
                          const status = formData.get("status") as string;
                          if (status) await updateComplaintStatus(cmp.id, status);
                        }}>
                          <Select defaultValue={cmp.status} name="status">
                            <SelectTrigger className="w-[180px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted (New)</SelectItem>
                              <SelectItem value="under_investigation">Under Investigation</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <button type="submit" className="hidden" id={`submit-${cmp.id}`}></button>
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
