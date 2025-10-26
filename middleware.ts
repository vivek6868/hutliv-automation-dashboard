import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Add debug log for current user
  console.log("[MIDDLEWARE][DEBUG] user.id:", user?.id);

  const path = request.nextUrl.pathname;
  const isLogin = path.startsWith("/login");
  const isOnboarding = path.startsWith("/onboarding");
  const isCallback = path.startsWith("/auth/callback");

  if (!user) {
    // If not authenticated, only allow login, onboarding, or callback
    if (!isLogin && !isOnboarding && !isCallback) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      console.log(
        "[MIDDLEWARE][DEBUG] Not authenticated, redirecting to /login"
      );
      return NextResponse.redirect(url);
    }
    console.log(
      "[MIDDLEWARE][DEBUG] Not authenticated, staying on login/onboarding/callback"
    );
    return supabaseResponse;
  }

  // Corrected: Only select "user_id"
  const { data: membership, error: memError } = await supabase
    .from("user_memberships")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  // DEBUG output for membership
  console.log(
    "[MIDDLEWARE][DEBUG] membership query result:",
    membership,
    "error:",
    memError
  );

  if (!membership) {
    // If on onboarding, let them stay; else redirect to onboarding
    if (!isOnboarding) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      console.log(
        "[MIDDLEWARE][DEBUG] No membership found; redirecting to /onboarding"
      );
      return NextResponse.redirect(url);
    }
    console.log(
      "[MIDDLEWARE][DEBUG] No membership, allowed to stay on onboarding"
    );
    return supabaseResponse;
  }

  // If has membership and tries to visit onboarding or login, redirect to dashboard/home
  if ((isOnboarding || isLogin) && membership) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    console.log("[MIDDLEWARE][DEBUG] Membership exists - redirect to /");
    return NextResponse.redirect(url);
  }

  console.log(
    "[MIDDLEWARE][DEBUG] Membership exists - allowing normal page load"
  );
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
