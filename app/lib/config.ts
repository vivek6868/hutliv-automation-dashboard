// Central configuration file
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  // For testing/development - will be replaced with auth.user.id in production
  testClientId: process.env.NEXT_PUBLIC_TEST_CLIENT_ID || "",
};
