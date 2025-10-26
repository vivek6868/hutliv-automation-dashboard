"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * This layout checks for:
 * - authenticated user
 * - onboarded user (exists in user_memberships)
 * and redirects automatically as needed.
 *
 * Usage: Wrap your dashboard/leads/campaigns pages with this layout.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function validate() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("[DEBUG] Current logged-in user ID:", user?.id); // <-- LOG USER ID

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: membership, error } = await supabase
        .from("user_memberships")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      console.log(
        "[DEBUG] Membership query result:",
        membership,
        "Error:",
        error
      ); // <-- LOG MEMBERSHIP RESULT

      if (!membership) {
        router.replace("/onboarding");
        return;
      }
      setChecking(false);
    }
    validate();
  }, [router]);

  if (checking) return null; // Or a loading spinner

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
