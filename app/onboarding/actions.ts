"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBusinessProfile(formData: FormData) {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "You must be logged in to create a business profile" }
    }

    // Extract form data
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
    }

    // Validate required fields
    if (!businessData.business_name || !businessData.whatsapp_number) {
      return { error: "Business name and WhatsApp number are required" }
    }

    // Create the client (business) record
    const { data: client, error: clientError } = await supabase.from("clients").insert([businessData]).select().single()

    if (clientError) {
      console.error("[v0] Error creating client:", clientError)
      return { error: "Failed to create business profile. Please try again." }
    }

    // Create the user_membership record
    const { error: membershipError } = await supabase.from("user_memberships").insert([
      {
        user_id: user.id,
        client_id: client.id,
        role: "owner",
      },
    ])

    if (membershipError) {
      console.error("[v0] Error creating membership:", membershipError)
      // Try to clean up the client record if membership creation fails
      await supabase.from("clients").delete().eq("id", client.id)
      return { error: "Failed to link business profile. Please try again." }
    }

    revalidatePath("/")
    return { success: true, clientId: client.id }
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
