"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createSiteStat, updateSiteStat, deleteSiteStat } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, X, Save, Loader2, BarChart3 } from "lucide-react";

type SiteStat = {
  id: string;
  label: string;
  value: string;
  icon_name: string;
  display_order: number;
};

const ICON_OPTIONS = ["FileText", "Globe", "MessageSquare", "Shield", "Radio", "BarChart3", "Users", "Smartphone", "Wifi", "Activity"];

export default function AdminStatsPage() {
  const [items, setItems] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteStat | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("site_stats").select("*").order("display_order");
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
        await updateSiteStat(editingItem.id, formData);
      } else {
        await createSiteStat(formData);
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
    if (!confirm("Delete this stat?")) return;
    try { await deleteSiteStat(id); await fetchItems(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Homepage Statistics</h1>
          <p className="text-muted-foreground text-sm">Manage the stat counters displayed in the hero section of the homepage.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setShowForm(true); }} className="bg-bocra-blue hover:bg-bocra-blue-light text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Stat
        </Button>
      </div>

      {showForm && (
        <Card className="border-bocra-blue/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-bocra-blue/5">
            <CardTitle className="text-lg">{editingItem ? "Edit Stat" : "New Stat"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingItem(null); }}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label *</Label>
                  <Input id="label" name="label" required defaultValue={editingItem?.label || ""} placeholder="e.g. Active Licences" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Input id="value" name="value" required defaultValue={editingItem?.value || ""} placeholder="e.g. 3,250+" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-bocra-blue" /> Current Stats ({items.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-bocra-blue" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No stats yet. Add one to display on the homepage.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Order</th>
                    <th className="px-6 py-3 font-semibold">Label</th>
                    <th className="px-6 py-3 font-semibold">Value</th>
                    <th className="px-6 py-3 font-semibold">Icon</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{item.display_order}</td>
                      <td className="px-6 py-4 font-medium">{item.label}</td>
                      <td className="px-6 py-4 font-bold text-bocra-blue">{item.value}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{item.icon_name}</td>
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
