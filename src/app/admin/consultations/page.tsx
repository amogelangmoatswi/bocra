"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createConsultation, updateConsultation, deleteConsultation } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from "lucide-react";

type Consultation = {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  document_url: string | null;
};

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Consultation | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("public_consultations")
      .select("*")
      .order("deadline", { ascending: true });
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
        await updateConsultation(editingItem.id, formData);
      } else {
        await createConsultation(formData);
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
    if (!confirm("Are you sure you want to delete this consultation?")) return;
    try {
      await deleteConsultation(id);
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
          <h1 className="text-2xl font-bold">Public Consultations</h1>
          <p className="text-muted-foreground text-sm">Manage active and archived consultation drafts.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-bocra-yellow hover:bg-bocra-yellow-light text-bocra-navy font-semibold shrink-0">
          <Plus className="w-4 h-4 mr-2" /> New Consultation
        </Button>
      </div>

      {showForm && (
        <Card className="border-bocra-yellow/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-bocra-yellow/5">
            <CardTitle className="text-lg">{editingItem ? "Edit Consultation" : "New Consultation"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingItem(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required defaultValue={editingItem?.title || ""} placeholder="e.g. Draft National Broadband Strategy" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea id="description" name="description" rows={4} required defaultValue={editingItem?.description || ""} placeholder="Describe the consultation..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select name="status" id="status" defaultValue={editingItem?.status || "published"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input id="deadline" name="deadline" type="date" required defaultValue={editingItem?.deadline || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_url">Document URL</Label>
                  <Input id="document_url" name="document_url" type="url" defaultValue={editingItem?.document_url || ""} placeholder="https://..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-bocra-yellow hover:bg-bocra-yellow-light text-bocra-navy font-semibold min-w-[100px]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{editingItem ? "Update" : "Create"}</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Consultations Directory ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 bg-muted/50 border-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-bocra-yellow" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No consultations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Deadline</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === "published" ? "default" : "secondary"} className={item.status === "archived" ? "bg-slate-200 text-slate-600" : ""}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{item.deadline}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-bocra-yellow hover:text-bocra-yellow hover:bg-bocra-yellow/10">
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
