"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Phone, Building, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    organisation: "",
    role: "user",
    email: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const supabase = createClient();
      
      // We rely on RLS: "Users can view own profile"
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", session?.user?.email)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfileData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          organisation: data.organisation || "",
          role: data.role,
          email: data.email,
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // Ensure we only update allowable fields. RLS allows users to "update own profile"
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          organisation: profileData.organisation,
          updated_at: new Date().toISOString(),
        })
        .eq("email", session?.user?.email);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // clear success msg after 5s
    } catch (err: any) {
      console.error("Error saving profile", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-bocra-blue border-t-transparent rounded-full max-w-7xl mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-bocra-navy pt-16 pb-12 px-4 relative overflow-hidden h-64 border-b-4 border-bocra-yellow">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover mix-blend-overlay"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Avatar Frame */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          <div className="w-32 h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center p-2 border border-slate-100">
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-bocra-blue to-bocra-green flex items-center justify-center text-5xl font-bold text-white uppercase tracking-widest shadow-inner">
              {profileData.full_name?.[0] || profileData.email?.[0] || "U"}
            </div>
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              {profileData.full_name || "Your Profile"}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {profileData.email}
              </span>
              <Badge variant="outline" className={`font-mono px-2 py-0.5 uppercase ${profileData.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                {profileData.role}
              </Badge>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-border/50 animate-fade-in-up">
          <CardHeader className="border-b border-border/50 bg-slate-50/50 dark:bg-muted/10">
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Update your personal information and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-200/50">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 border border-green-200/50">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      placeholder="e.g. Kagiso Motso"
                      className="pl-10"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisation">Organisation (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="organisation"
                      placeholder="e.g. Mascom Wireless"
                      className="pl-10"
                      value={profileData.organisation}
                      onChange={(e) => setProfileData({ ...profileData, organisation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+267 71 234 567"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Registered Email</Label>
                  <div className="relative opacity-60 pointer-events-none">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      readOnly
                      className="pl-10 bg-muted"
                      value={profileData.email}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Emails cannot be changed directly.</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/50 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-bocra-blue hover:bg-bocra-blue-light text-white min-w-[140px]"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
