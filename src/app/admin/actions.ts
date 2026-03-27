"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ─── Helpers ──────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

type ActionResult = { success: true } | { success: false; error: string };

function fail(err: unknown): ActionResult {
  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  return { success: false, error: message };
}

// ─── Zod Schemas ──────────────────────────────────────────

const NewsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().optional().default(""),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publish_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

const ConsultationSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  document_url: z.string().url().optional().or(z.literal("")),
});

const CyberAlertSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  date_issued: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

const SiteStatSchema = z.object({
  label: z.string().min(2).max(100),
  value: z.string().min(1).max(50),
  icon_name: z.string().min(1).max(50),
  display_order: z.coerce.number().int().min(0).max(100),
});

const LicenceTypeSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.string().min(2).max(50),
  description: z.string().min(10).max(1000),
  examples: z.string().max(500).optional().default(""),
  icon_name: z.string().min(1).max(50),
  display_order: z.coerce.number().int().min(0).max(100),
});

// ─── Helper to extract & validate FormData ────────────────

function parseForm<T extends z.ZodTypeAny>(schema: T, formData: FormData): z.infer<T> {
  const raw: Record<string, string> = {};
  formData.forEach((value, key) => {
    raw[key] = value.toString();
  });
  return schema.parse(raw);
}

// =============================================
// NEWS ARTICLES
// =============================================

export async function createNewsArticle(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(NewsSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("news_articles").insert({
      ...data,
      content: data.content || null,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/news");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateNewsArticle(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(NewsSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("news_articles")
      .update({ ...data, content: data.content || null, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/news");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteNewsArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("news_articles").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/news");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// PUBLIC CONSULTATIONS
// =============================================

export async function createConsultation(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(ConsultationSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("public_consultations").insert({
      ...data,
      document_url: data.document_url || null,
    });
    if (error) throw new Error(error.message);
    revalidatePath("/admin/consultations");
    revalidatePath("/consultation");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateConsultation(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(ConsultationSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("public_consultations")
      .update({ ...data, document_url: data.document_url || null, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/consultations");
    revalidatePath("/consultation");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteConsultation(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("public_consultations").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/consultations");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// CYBER ALERTS
// =============================================

export async function createCyberAlert(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(CyberAlertSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("cyber_alerts").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/cybersecurity");
    revalidatePath("/cybersecurity");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateCyberAlert(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(CyberAlertSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("cyber_alerts")
      .update(data)
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/cybersecurity");
    revalidatePath("/cybersecurity");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteCyberAlert(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("cyber_alerts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/cybersecurity");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// SITE STATS (Homepage)
// =============================================

export async function createSiteStat(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(SiteStatSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("site_stats").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/stats");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateSiteStat(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(SiteStatSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("site_stats")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/stats");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteSiteStat(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("site_stats").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/stats");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// LICENCE TYPES (Catalogue)
// =============================================

export async function createLicenceType(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(LicenceTypeSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("licence_types").insert(data);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/licences");
    revalidatePath("/licensing");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function updateLicenceType(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = parseForm(LicenceTypeSchema, formData);
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("licence_types")
      .update(data)
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/licences");
    revalidatePath("/licensing");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteLicenceType(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("licence_types").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/licences");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// DASHBOARD DATASETS (Chart data)
// =============================================

export async function upsertDashboardDataset(name: string, dataJson: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    // Validate JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(dataJson);
    } catch {
      return { success: false, error: "Invalid JSON format" };
    }
    if (!Array.isArray(parsed)) {
      return { success: false, error: "Dataset must be a JSON array" };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("dashboard_datasets")
      .upsert(
        { dataset_name: name, data_json: parsed, updated_at: new Date().toISOString() },
        { onConflict: "dataset_name" }
      );
    if (error) throw new Error(error.message);
    revalidatePath("/admin/dashboard-data");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteDashboardDataset(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("dashboard_datasets").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/dashboard-data");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

// =============================================
// LICENCE APPLICATIONS (User + Admin)
// =============================================

const LicenceApplicationSchema = z.object({
  licence_type: z.enum([
    "nfp_individual", "nfp_class", "ecs_individual", "ecs_class",
    "spectrum", "type_approval", "postal", "courier"
  ]),
  company_name: z.string().min(2, "Company name is required").max(200),
  contact_person: z.string().min(2, "Contact person is required").max(100).optional(),
  contact_email: z.string().email("Valid email is required").optional(),
  contact_phone: z.string().min(7).max(20).optional(),
  description: z.string().max(2000).optional(),
});

/** User submits a new licence application */
export async function submitLicenceApplication(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to apply." };
    }

    const raw: Record<string, string> = {};
    formData.forEach((v, k) => { raw[k] = v.toString(); });
    const data = LicenceApplicationSchema.parse(raw);

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("licence_applications").insert({
      user_id: (session.user as any).id,
      licence_type: data.licence_type,
      company_name: data.company_name,
      status: "submitted",
    });
    if (error) throw new Error(error.message);
    revalidatePath("/licensing/apply");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}

/** Admin updates the status of an application */
export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validStatuses = ["draft", "submitted", "under_review", "approved", "rejected", "expired"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("licence_applications")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/applications");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}
