import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ShieldCheck, Newspaper, Users, AlertTriangle, LayoutDashboard, ChevronLeft, BarChart3, FileText, Database, ClipboardList, Globe } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Middleware should catch this, but double check auth & role here to be safe
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-muted/10 flex flex-col md:flex-row pb-12">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-bocra-navy text-white flex-shrink-0 md:min-h-[calc(100vh-80px)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-bocra-blue flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Admin Portal</h2>
              <p className="text-xs text-bocra-blue-light/80">Content Management</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold px-4 pt-2 pb-1">Overview</p>
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold px-4 pt-4 pb-1">Content</p>
            <Link 
              href="/admin/news" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Newspaper className="w-4 h-4" />
              News & Advisories
            </Link>
            <Link 
              href="/admin/consultations" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Users className="w-4 h-4" />
              Consultations
            </Link>
            <Link 
              href="/admin/cybersecurity" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Cyber Alerts
            </Link>
            <Link 
              href="/admin/applications" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              Applications
            </Link>
            <Link 
              href="/admin/complaints" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Complaints
            </Link>
            <Link 
              href="/admin/domains" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Domains
            </Link>

            <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold px-4 pt-4 pb-1">Site Config</p>
            <Link 
              href="/admin/stats" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Homepage Stats
            </Link>
            <Link 
              href="/admin/licences" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Licence Types
            </Link>
            <Link 
              href="/admin/dashboard-data" 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Database className="w-4 h-4" />
              Dashboard Data
            </Link>
          </nav>
        </div>
        
        <div className="p-6 mt-auto">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
