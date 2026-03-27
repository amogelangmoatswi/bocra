"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createCyberAlert, updateCyberAlert, deleteCyberAlert } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from "lucide-react";

type CyberAlert = {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  date_issued: string;
};

const getSeverityColor = (sev: string) => {
  switch (sev) {
    case "critical": return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200";
    case "high": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200";
    case "medium": return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200";
    default: return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200";
  }
};

export default function AdminCybersecurityPage() {
  const [items, setItems] = useState<CyberAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CyberAlert | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("cyber_alerts")
      .select("*")
      .order("date_issued", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      if (editingItem) {
        await updateCyberAlert(editingItem.id, formData);
      } else {
        await createCyberAlert(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      await fetchItems();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;
    try {
      await deleteCyberAlert(id);
      await fetchItems();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const filtered = items.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cybersecurity Alerts</h1>
          <p className="text-muted-foreground text-sm">Issue and manage national threat warnings to the bwCIRT hub.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-red-600 hover:bg-red-700 text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Issue Alert
        </Button>
      </div>

      {showForm && (
        <Card className="border-red-500/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-red-50/50 dark:bg-red-950/10">
            <CardTitle className="text-lg">{editingItem ? "Edit Alert" : "Issue New Alert"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingItem(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="title">Alert Title *</Label>
                <Input id="title" name="title" required defaultValue={editingItem?.title || ""} placeholder="e.g. Critical RCE Vulnerability in XYZ Firewall" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Guidance *</Label>
                <textarea id="description" name="description" rows={4} required defaultValue={editingItem?.description || ""} placeholder="Describe the threat, affected systems, and recommended actions..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <select name="severity" id="severity" defaultValue={editingItem?.severity || "medium"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select name="status" id="status" defaultValue={editingItem?.status || "published"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_issued">Date Issued</Label>
                  <Input id="date_issued" name="date_issued" type="date" defaultValue={editingItem?.date_issued || new Date().toISOString().split("T")[0]} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{editingItem ? "Update" : "Issue"}</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Threat Advisories ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Lookup CVE or Title..." className="pl-8 bg-muted/50 border-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-red-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No alerts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Severity</th>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Date Issued</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`font-semibold uppercase text-[10px] ${getSeverityColor(item.severity)}`}>
                          {item.severity}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">{item.date_issued}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-slate-500 hover:text-slate-700">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
