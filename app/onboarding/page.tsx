"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Building2, Phone, Mail, MapPin, Globe } from "lucide-react";
import { createBusinessProfile } from "./actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function checkMembership() {
      console.log("[DEBUG] [OnboardingPage] Getting Supabase client");
      const supabase = getSupabaseBrowserClient();

      console.log("[DEBUG] [OnboardingPage] Fetching user...");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.log(
          "[DEBUG] [OnboardingPage] No user found or error:",
          userError
        );
        return;
      }
      console.log("[DEBUG] [OnboardingPage] User is:", user);

      console.log(
        "[DEBUG] [OnboardingPage] Checking membership for user_id:",
        user.id
      );
      // Query for user_id, not id
      const { data: membership, error: membershipError } = await supabase
        .from("user_memberships")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (membershipError) {
        console.log(
          "[DEBUG] [OnboardingPage] Membership query error:",
          membershipError
        );
      } else {
        console.log("[DEBUG] [OnboardingPage] Membership result:", membership);
      }

      // If already a member, redirect
      if (active && membership) {
        console.log(
          "[DEBUG] [OnboardingPage] Membership exists, redirecting to home..."
        );
        router.replace("/"); // SPA navigation, not full reload
      }
    }
    checkMembership();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    console.log(
      "[DEBUG] [OnboardingPage] Submit business form data:",
      Object.fromEntries(formData)
    );
    try {
      const result = await createBusinessProfile(formData);
      if (result.error) {
        console.log(
          "[DEBUG] [OnboardingPage] Profile creation error:",
          result.error
        );
        setError(result.error);
      } else {
        console.log(
          "[DEBUG] [OnboardingPage] Profile creation success, redirecting..."
        );
        router.replace("/");
      }
    } catch (err) {
      console.log("[DEBUG] [OnboardingPage] Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-2xl relative backdrop-blur-sm bg-card/95 border-primary/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to WhatsApp Business CRM
          </CardTitle>
          <CardDescription className="text-base">
            Let's set up your business profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Business Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    name="business_name"
                    placeholder="Enter your business name"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select name="business_type" disabled={isLoading}>
                    <SelectTrigger id="business_type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@example.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">
                    WhatsApp Business Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-whatsapp" />
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street address"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Mumbai"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Maharashtra"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://yourbusiness.com"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating your profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
