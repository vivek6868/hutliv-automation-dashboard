import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerClient()
    await supabase.auth.exchangeCodeForSession(code)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: membership } = await supabase.from("user_memberships").select("id").eq("user_id", user.id).single()

      // If no membership found, redirect to onboarding
      if (!membership) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  // Redirect to dashboard if membership exists
  return NextResponse.redirect(`${origin}/`)
}
