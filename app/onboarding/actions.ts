"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper for UI "preflight check"
export async function checkWhatsappNumberUsed(whatsapp_number: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("whatsapp_number", whatsapp_number)
    .single();
  return !!data; // true if in use, false if not
}

export async function createBusinessProfile(formData: FormData) {
  try {
    const supabase = await createServerClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return { error: "You must be logged in to create a business profile." };
    }

    // Extract and validate form data
    const businessData = {
      business_name: formData.get("business_name") as string,
      business_type: formData.get("business_type") as string,
      phone_number: formData.get("phone_number") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      whatsapp_number: formData.get("whatsapp_number") as string,
      website: formData.get("website") as string,
      country: "India",
    };
    if (!businessData.business_name || !businessData.whatsapp_number) {
      return { error: "Business name and WhatsApp number are required." };
    }

    // Final, backend-side uniqueness check for WhatsApp number
    const { data: conflict } = await supabase
      .from("clients")
      .select("id")
      .eq("whatsapp_number", businessData.whatsapp_number)
      .single();
    if (conflict) {
      return {
        error:
          "This WhatsApp number is already used in another business profile. Please use a different number.",
      };
    }

    // Create the client/business record
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert([businessData])
      .select()
      .single();
    if (clientError) {
      // Most likely a race or unique constraint fail
      return {
        error:
          "This WhatsApp number is already used in another business profile. Please use a different number.",
      };
    }

    // Create the user_membership record
    const { error: membershipError } = await supabase
      .from("user_memberships")
      .insert([
        {
          user_id: user.id,
          client_id: client.id,
          role: "owner",
        },
      ]);
    if (membershipError) {
      // Clean up the failed client record
      await supabase.from("clients").delete().eq("id", client.id);
      return { error: "Failed to link business profile. Please try again." };
    }

    revalidatePath("/");
    return { success: true, clientId: client.id };
  } catch (error: any) {
    // Detailed logic for unique violation/constraint error
    if (
      typeof error.message === "string" &&
      error.message.includes("duplicate key")
    ) {
      return {
        error:
          "This WhatsApp number is already used in another business profile. Please use a different number.",
      };
    }
    return { error: "An unexpected error occurred. Please try again." };
  }
}
