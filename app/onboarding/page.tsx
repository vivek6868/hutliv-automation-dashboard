"use client";

import React, { useState, useEffect } from "react";
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
import {
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { createBusinessProfile, checkWhatsappNumberUsed } from "./actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Sanitize WhatsApp number input - always keep "+91" prefix and max 10 digits
function sanitizeWA(num: string) {
  if (!num.startsWith("+91")) num = "+91" + num.replace(/^\+?91?/, "");
  num = "+91" + num.slice(3).replace(/[^\d]/g, "");
  return num.slice(0, 13); // +91 and 10 digits max
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WhatsApp number state
  const [whatsappNumber, setWhatsappNumber] = useState("+91");
  const [isWhatsappUsed, setIsWhatsappUsed] = useState(false);
  const [checkingNumber, setCheckingNumber] = useState(false);

  // WhatsApp local validation: exactly 10 digits after +91 (total 13 chars)
  const wa10Digits =
    /^\+91\d{10}$/.test(whatsappNumber) && whatsappNumber.length === 13;
  const waOnlyWarning =
    /^\+91\d+$/.test(whatsappNumber) && whatsappNumber.length < 13;

  useEffect(() => {
    let active = true;
    async function checkMembership() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: membership } = await supabase
        .from("user_memberships")
        .select("user_id")
        .eq("user_id", user.id)
        .single();
      if (active && membership) router.replace("/");
    }
    checkMembership();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleWhatsappCheck(number: string) {
    if (!/^\+91\d{10}$/.test(number)) return;
    setCheckingNumber(true);
    setError(null);
    try {
      const used = await checkWhatsappNumberUsed(number);
      setIsWhatsappUsed(used);
    } catch (err) {
      setError("Error checking WhatsApp number. Try again.");
      setIsWhatsappUsed(false);
    } finally {
      setCheckingNumber(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("whatsapp_number", whatsappNumber); // enforce sanitized value!
    try {
      const result = await createBusinessProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.replace("/");
      }
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // LOGOUT handler
  async function handleLogout() {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    window.location.href = "/login"; // or "/" or your landing page
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <Card className="w-full max-w-2xl relative backdrop-blur-sm bg-card/95 border-primary/20">
        {/* LOGOUT BUTTON TOP RIGHT */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Logout"
            onClick={handleLogout}
            className="text-xs"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
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
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
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
                      className="pl-10"
                      required
                      disabled={isLoading}
                      value={whatsappNumber}
                      onChange={(e) => {
                        const val = sanitizeWA(e.target.value);
                        setWhatsappNumber(val);
                        setIsWhatsappUsed(false);
                        setError(null);
                      }}
                      onBlur={() => {
                        if (wa10Digits) handleWhatsappCheck(whatsappNumber);
                        else setIsWhatsappUsed(false);
                      }}
                      maxLength={13}
                    />
                  </div>
                  {waOnlyWarning && !wa10Digits && (
                    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 p-1 rounded mt-1">
                      <AlertCircle className="w-4 h-4" />
                      Must be exactly 10 digits after +91.
                    </div>
                  )}
                  {checkingNumber && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Checking number...
                    </div>
                  )}
                  {isWhatsappUsed && wa10Digits && (
                    <div className="text-xs text-destructive mt-1">
                      This WhatsApp number is already registered by another
                      business. Please use a different number.
                    </div>
                  )}
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
                  <Input id="address" name="address" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" disabled={isLoading} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      type="url"
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
              disabled={
                isLoading || isWhatsappUsed || checkingNumber || !wa10Digits
              }
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
