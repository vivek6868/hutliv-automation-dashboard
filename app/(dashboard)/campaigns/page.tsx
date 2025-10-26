"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Remove mockCampaigns, will load real campaigns from Supabase

const statusConfig = {
  active: { label: "Active", className: "bg-accent text-accent-foreground" },
  scheduled: {
    label: "Scheduled",
    className: "bg-primary text-primary-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground",
  },
  draft: {
    label: "Draft",
    className: "bg-secondary text-secondary-foreground",
  },
  paused: {
    label: "Paused",
    className: "bg-destructive text-destructive-foreground",
  },
};

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchCampaigns() {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        setCampaigns([]);
        setLoading(false);
        return;
      }
      // Get client_id for this user
      const { data: membership, error: memError } = await supabase
        .from("user_memberships")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (memError || !membership?.client_id) {
        setError("You do not belong to a client. Contact admin.");
        setCampaigns([]);
        setLoading(false);
        return;
      }
      // Fetch campaigns for this client
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("client_id", membership.client_id)
        .order("created_at", { ascending: false });
      if (error) {
        setError("Could not fetch campaigns.");
        setCampaigns([]);
      } else {
        setCampaigns(data || []);
      }
      setLoading(false);
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Campaigns
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your WhatsApp campaigns
            </p>
          </div>
          {/* Dialog for New Campaign */}
          {/* ...leave as is, but add Supabase INSERT later... */}
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        {/* Campaign Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Campaigns
              </CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : campaigns.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading
                  ? ""
                  : `${
                      campaigns.filter((c) => c.status === "active").length
                    } active, ${
                      campaigns.filter((c) => c.status === "completed").length
                    } completed`}
              </p>
            </CardContent>
          </Card>
          {/* ...other stat cards... */}
        </div>
        {/* Campaigns List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <Card>
              <CardContent>Loading campaigns…</CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-destructive">{error}</CardContent>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card>
              <CardContent>No campaigns found for your client.</CardContent>
            </Card>
          ) : (
            campaigns.map((campaign) => (
              <Card key={campaign.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {campaign.campaign_name}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {campaign.type}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        statusConfig[
                          campaign.status as keyof typeof statusConfig
                        ]?.className ?? ""
                      }
                    >
                      {statusConfig[
                        campaign.status as keyof typeof statusConfig
                      ]?.label ?? campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Audience</span>
                      <span className="font-medium">
                        {campaign.audience?.toLocaleString() ?? "—"}
                      </span>
                    </div>
                    {/* Add other stats as present in your table */}
                    {campaign.sent > 0 && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Sent</span>
                          <span className="font-medium">
                            {campaign.sent?.toLocaleString() ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Delivered
                          </span>
                          <span className="font-medium">
                            {campaign.delivered?.toLocaleString() ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Read</span>
                          <span className="font-medium">
                            {campaign.read?.toLocaleString() ?? "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Replied</span>
                          <span className="font-medium text-accent">
                            {campaign.replied?.toLocaleString() ?? "—"}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Scheduled</span>
                      <span className="font-medium">
                        {campaign.scheduled ?? "Not scheduled"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Message Preview:
                    </p>
                    <p className="line-clamp-2 text-sm">{campaign.message}</p>
                  </div>
                  {/* Dialog triggers, action buttons, etc – same as before */}
                  {/* Use selectedCampaign for editing */}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Megaphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
