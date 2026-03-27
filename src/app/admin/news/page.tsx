"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { createNewsArticle, updateNewsArticle, deleteNewsArticle } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from "lucide-react";

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  content: string | null;
  status: string;
  publish_date: string;
};

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("news_articles")
      .select("*")
      .order("publish_date", { ascending: false });
    setNews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNews(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      if (editingItem) {
        await updateNewsArticle(editingItem.id, formData);
      } else {
        await createNewsArticle(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      await fetchNews();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteNewsArticle(id);
      await fetchNews();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const openEdit = (item: NewsArticle) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage News & Advisories</h1>
          <p className="text-muted-foreground text-sm">Create, edit, and publish content to the Home Page.</p>
        </div>
        <Button onClick={openCreate} className="bg-bocra-blue hover:bg-bocra-blue-light text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Article
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="border-bocra-blue/30 shadow-lg animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-bocra-blue/5">
            <CardTitle className="text-lg">{editingItem ? "Edit Article" : "New Article"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditingItem(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required defaultValue={editingItem?.title || ""} placeholder="e.g. BOCRA Issues 5G Guidelines" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select name="status" id="status" defaultValue={editingItem?.status || "draft"} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input id="publish_date" name="publish_date" type="date" defaultValue={editingItem?.publish_date || new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary *</Label>
                <Input id="excerpt" name="excerpt" required defaultValue={editingItem?.excerpt || ""} placeholder="A short summary shown in listings..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Full Content (Optional)</Label>
                <textarea id="content" name="content" rows={5} defaultValue={editingItem?.content || ""} placeholder="Full article body..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-bocra-blue hover:bg-bocra-blue-light text-white min-w-[100px]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{editingItem ? "Update" : "Create"}</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">All Articles ({filtered.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search articles..." className="pl-8 bg-muted/50 border-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-bocra-blue" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No articles found. Click &quot;Create Article&quot; to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Publish Date</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{item.excerpt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === "published" ? "default" : "secondary"} className={item.status === "published" ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 shadow-none" : ""}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{item.publish_date}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="text-bocra-blue hover:text-bocra-blue hover:bg-bocra-blue/10">
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
