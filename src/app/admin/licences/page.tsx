"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createLicenceType, updateLicenceType, deleteLicenceType } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from "lucide-react";

type LicenceType = {
  id: string;
  title: string;
  category: string;
  description: string;
  examples: string | null;
  icon_name: string;
  display_order: number;
};

const CATEGORIES = ["Infrastructure", "Services", "Content", "Postal", "Internet", "Spectrum"];
const ICON_OPTIONS = ["FileText", "Smartphone", "Radio", "Mail", "Wifi", "Globe", "Monitor", "Activity", "Shield", "Settings"];

export default function AdminLicencesPage() {
  const [items, setItems] = useState<LicenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LicenceType | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("licence_types").select("*").order("display_order");
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
        await updateLicenceType(editingItem.id, formData);
      } else {
        await createLicenceType(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      await fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this licence type?")) return;
    try { await deleteLicenceType(id); await fetchItems(); } catch (err: any) { alert(err.message); }
  };

  const filtered = items.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Licence Types Catalogue</h1>
          <p className="text-muted-foreground text-sm">Manage the licence categories shown on the public Licensing page.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-bocra-blue hover:bg-bocra-blue-light text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Licence Type
        </Button>
      </div>

      {showForm && (
        <Card className="border-bocra-blue/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-bocra-blue/5">
            <CardTitle className="text-lg">{editingItem ? "Edit Licence Type" : "New Licence Type"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingItem(null); }}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required defaultValue={editingItem?.title || ""} placeholder="e.g. Network Facilities Provider" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select name="category" id="category" defaultValue={editingItem?.category || "Infrastructure"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea id="description" name="description" rows={3} required defaultValue={editingItem?.description || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" placeholder="What this licence covers..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examples">Examples</Label>
                  <Input id="examples" name="examples" defaultValue={editingItem?.examples || ""} placeholder="e.g. BTC, Mascom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon_name">Icon</Label>
                  <select name="icon_name" id="icon_name" defaultValue={editingItem?.icon_name || "FileText"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input id="display_order" name="display_order" type="number" defaultValue={editingItem?.display_order ?? 0} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-bocra-blue text-white min-w-[100px]">
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
            <CardTitle className="text-lg">All Licence Types ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 bg-muted/50 border-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-bocra-blue" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No licence types found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Examples</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{item.display_order}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</div>
                      </td>
                      <td className="px-6 py-4"><Badge variant="secondary">{item.category}</Badge></td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{item.examples || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-bocra-blue hover:bg-bocra-blue/10"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
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
