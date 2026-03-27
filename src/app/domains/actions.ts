"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true; data?: any } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

const DomainSchema = z.object({
  domain_name: z.string().min(3).max(63).regex(/^[a-zA-Z0-9-]+\.(bw|co\.bw|org\.bw|ac\.bw|gov\.bw|net\.bw|shop\.bw|agric\.bw|me\.bw)$/, "Invalid .bw domain format"),
});

/** User registers a new domain */
export async function registerDomain(domainName: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "You must be logged in to register a domain." };
    }

    const data = DomainSchema.parse({ domain_name: domainName });

    const supabase = await createServerSupabaseClient();
    
    // Check if domain exists
    const { data: existing } = await supabase
      .from("domain_registrations")
      .select("id")
      .eq("domain_name", data.domain_name.toLowerCase())
      .single();
      
    if (existing) {
      return { success: false, error: "Domain is already registered by someone else." };
    }

    const { error } = await supabase.from("domain_registrations").insert({
      user_id: (session.user as any).id,
      domain_name: data.domain_name.toLowerCase(),
      status: "pending",
    });
    
    if (error) throw new Error(error.message);
    
    revalidatePath("/domains/manage");
    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: err.issues[0].message };
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}

/** Admin updates domain status */
export async function updateDomainStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const validStatuses = ["pending", "active", "expired", "suspended"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("domain_registrations")
      .update({ status })
      .eq("id", id);
      
    if (error) throw new Error(error.message);
    
    revalidatePath("/admin/domains");
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}
