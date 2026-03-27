"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { upsertDashboardDataset, deleteDashboardDataset } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Loader2, Trash2, Database, Edit, X } from "lucide-react";

type Dataset = {
  id: string;
  dataset_name: string;
  data_json: any;
  updated_at: string;
};

const PRESET_DATASETS = [
  {
    name: "mobile_subscribers",
    label: "Mobile Subscriptions (Millions)",
    sampleJson: JSON.stringify([
      { year: "2019", subscribers: 3.8 },
      { year: "2020", subscribers: 3.9 },
      { year: "2021", subscribers: 4.1 },
      { year: "2022", subscribers: 4.3 },
      { year: "2023", subscribers: 4.5 },
      { year: "2024", subscribers: 4.8 },
    ], null, 2),
  },
  {
    name: "market_share",
    label: "Mobile Market Share",
    sampleJson: JSON.stringify([
      { name: "Mascom", value: 45, color: "#F59E0B" },
      { name: "Orange", value: 35, color: "#ea580c" },
      { name: "BTC", value: 20, color: "#16a34a" },
    ], null, 2),
  },
  {
    name: "qos_metrics",
    label: "Quality of Service Metrics",
    sampleJson: JSON.stringify([
      { month: "Jan", "Call Setup Success": 99.2, "Drop Call Rate": 0.8 },
      { month: "Feb", "Call Setup Success": 98.9, "Drop Call Rate": 0.9 },
      { month: "Mar", "Call Setup Success": 99.5, "Drop Call Rate": 0.5 },
      { month: "Apr", "Call Setup Success": 99.1, "Drop Call Rate": 0.7 },
      { month: "May", "Call Setup Success": 99.4, "Drop Call Rate": 0.6 },
      { month: "Jun", "Call Setup Success": 99.6, "Drop Call Rate": 0.4 },
    ], null, 2),
  },
];

export default function AdminDashboardDataPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingJson, setEditingJson] = useState("");
  const [customName, setCustomName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const fetchItems = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("dashboard_datasets").select("*").order("dataset_name");
    setDatasets(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editingName) return;
    setSaving(true);
    setError("");
    try {
      JSON.parse(editingJson); // Validate JSON
      await upsertDashboardDataset(editingName, editingJson);
      setEditingName(null);
      setEditingJson("");
      await fetchItems();
    } catch (err: any) {
      setError(err.message.includes("Unexpected") ? "Invalid JSON format" : err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this dataset?")) return;
    try { await deleteDashboardDataset(id); await fetchItems(); } catch (err: any) { alert(err.message); }
  };

  const openPreset = (preset: typeof PRESET_DATASETS[0]) => {
    const existing = datasets.find(d => d.dataset_name === preset.name);
    setEditingName(preset.name);
    setEditingJson(existing ? JSON.stringify(existing.data_json, null, 2) : preset.sampleJson);
  };

  const openCustom = () => {
    setShowCustom(true);
    setEditingName(null);
    setEditingJson("[\n  \n]");
  };

  const saveCustom = async () => {
    if (!customName.trim()) { setError("Dataset name is required"); return; }
    setSaving(true);
    setError("");
    try {
      JSON.parse(editingJson);
      await upsertDashboardDataset(customName.trim(), editingJson);
      setShowCustom(false);
      setCustomName("");
      setEditingJson("");
      await fetchItems();
    } catch (err: any) {
      setError(err.message.includes("Unexpected") ? "Invalid JSON format" : err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Data Management</h1>
          <p className="text-muted-foreground text-sm">Update the datasets that power the public Telecoms Statistics dashboard.</p>
        </div>
        <Button onClick={openCustom} className="bg-bocra-blue hover:bg-bocra-blue-light text-white">
          <Plus className="w-4 h-4 mr-2" /> Custom Dataset
        </Button>
      </div>

      {/* Preset Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESET_DATASETS.map((preset) => {
          const exists = datasets.find(d => d.dataset_name === preset.name);
          return (
            <Card key={preset.name} className="hover:border-bocra-blue/30 transition-colors cursor-pointer" onClick={() => openPreset(preset)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{preset.label}</p>
                  <p className="text-xs text-muted-foreground">{exists ? `Last updated: ${new Date(exists.updated_at).toLocaleDateString()}` : "Not configured yet"}</p>
                </div>
                <Edit className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Editing Panel */}
      {editingName && (
        <Card className="border-bocra-blue/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-bocra-blue/5">
            <CardTitle className="text-lg">Editing: <code className="text-bocra-blue">{editingName}</code></CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setEditingName(null)}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="space-y-2">
              <Label>JSON Data</Label>
              <textarea
                rows={12}
                value={editingJson}
                onChange={(e) => setEditingJson(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
                spellCheck={false}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingName(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-bocra-blue text-white min-w-[100px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Dataset</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Dataset Form */}
      {showCustom && (
        <Card className="border-bocra-blue/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-bocra-blue/5">
            <CardTitle className="text-lg">New Custom Dataset</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowCustom(false)}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            <div className="space-y-2">
              <Label>Dataset Name *</Label>
              <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. broadband_penetration" />
            </div>
            <div className="space-y-2">
              <Label>JSON Data</Label>
              <textarea rows={8} value={editingJson} onChange={(e) => setEditingJson(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y" spellCheck={false} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCustom(false)}>Cancel</Button>
              <Button onClick={saveCustom} disabled={saving} className="bg-bocra-blue text-white min-w-[100px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Create</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Datasets Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Database className="w-5 h-5 text-bocra-blue" /> All Datasets ({datasets.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-bocra-blue" /></div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No datasets configured. Use the presets above to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Dataset Name</th>
                    <th className="px-6 py-3 font-semibold">Records</th>
                    <th className="px-6 py-3 font-semibold">Last Updated</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {datasets.map((ds) => (
                    <tr key={ds.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-foreground">{ds.dataset_name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{Array.isArray(ds.data_json) ? ds.data_json.length : "—"} entries</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(ds.updated_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingName(ds.dataset_name); setEditingJson(JSON.stringify(ds.data_json, null, 2)); }} className="text-bocra-blue hover:bg-bocra-blue/10"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ds.id)} className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
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
