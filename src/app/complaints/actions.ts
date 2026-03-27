"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string };

function fail(err: unknown): ActionResult {
  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  return { success: false, error: message };
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

const ComplaintSchema = z.object({
  provider: z.string().min(2, "Provider is required").max(100),
  category: z.enum(["billing", "service_quality", "customer_service", "privacy", "equipment", "other"]).default("other"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  description: z.string().min(20, "Please provide more details (min 20 characters)").max(3000),
});

/** User submits a new complaint */
export async function submitComplaint(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to file a complaint." };
    }

    const raw: Record<string, string> = {};
    formData.forEach((v, k) => { raw[k] = v.toString(); });
    const data = ComplaintSchema.parse(raw);

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("complaints").insert({
      user_id: (session.user as any).id,
      ...data,
      status: "submitted",
    });
    
    if (error) throw new Error(error.message);
    
    revalidatePath("/complaints");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return fail(err);
  }
}

/** Admin updates the status of a complaint */
export async function updateComplaintStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validStatuses = ["submitted", "under_investigation", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("complaints")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) throw new Error(error.message);
    
    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (err) {
    return fail(err);
  }
}
