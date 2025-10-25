"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Plus,
  Send,
  Eye,
  Calendar,
  Users,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { config } from "../lib/config";

const statusConfig = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-800" },
  sent: { label: "Sent", className: "bg-green-100 text-green-800" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-800" },
};

interface Campaign {
  id: string;
  campaign_name: string;
  message: string;
  status: "draft" | "scheduled" | "sent" | "completed";
  total_sent: number;
  total_delivered: number;
  total_read: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCampaigns, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("client_id", config.testClientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        return;
      }

      setCampaigns(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString();
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaign_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      campaign.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage bulk WhatsApp campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns ({filteredCampaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No campaigns found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first campaign to send bulk WhatsApp messages
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Read</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        {campaign.campaign_name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            statusConfig[campaign.status]?.className || ""
                          }
                        >
                          {statusConfig[campaign.status]?.label ||
                            campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.total_sent || 0}</TableCell>
                      <TableCell>{campaign.total_delivered || 0}</TableCell>
                      <TableCell>{campaign.total_read || 0}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(campaign.scheduled_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedCampaign(campaign)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Campaign Details</DialogTitle>
                                <DialogDescription>
                                  View campaign information and stats
                                </DialogDescription>
                              </DialogHeader>
                              {selectedCampaign && (
                                <div className="space-y-6">
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label>Campaign Name</Label>
                                      <Input
                                        value={selectedCampaign.campaign_name}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Input
                                        value={selectedCampaign.status}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                      value={selectedCampaign.message}
                                      readOnly
                                      rows={4}
                                    />
                                  </div>
                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                      <Label>Total Sent</Label>
                                      <Input
                                        value={selectedCampaign.total_sent || 0}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Delivered</Label>
                                      <Input
                                        value={
                                          selectedCampaign.total_delivered || 0
                                        }
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Read</Label>
                                      <Input
                                        value={selectedCampaign.total_read || 0}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
