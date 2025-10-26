import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOnLoginPage = request.nextUrl.pathname.startsWith("/login")
  const isOnOnboardingPage = request.nextUrl.pathname.startsWith("/onboarding")
  const isOnAuthCallback = request.nextUrl.pathname.startsWith("/auth/callback")

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && !isOnLoginPage && !isOnAuthCallback) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user && !isOnLoginPage && !isOnAuthCallback) {
    const { data: membership } = await supabase.from("user_memberships").select("id").eq("user_id", user.id).single()

    // If no membership and not on onboarding page, redirect to onboarding
    if (!membership && !isOnOnboardingPage) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }

    // If has membership and on onboarding page, redirect to dashboard
    if (membership && isOnOnboardingPage) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    // If has membership and on login page, redirect to dashboard
    if (membership && isOnLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
