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
  Filter,
  Eye,
  Reply,
  Archive,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  contacted: {
    label: "Contacted",
    className: "bg-primary text-primary-foreground",
  },
  qualified: {
    label: "Qualified",
    className: "bg-secondary text-secondary-foreground",
  },
  converted: { label: "Converted", className: "bg-chart-5 text-foreground" },
  lost: { label: "Lost", className: "bg-muted text-muted-foreground" },
};

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        setLeads([]);
        setLoading(false);
        return;
      }
      // Find this user's client_id
      const { data: membership, error: memError } = await supabase
        .from("user_memberships")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (memError || !membership?.client_id) {
        setError(
          "You do not belong to a client. Contact your admin or onboarding failed."
        );
        setLeads([]);
        setLoading(false);
        return;
      }
      // Fetch leads for ONLY this client
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("client_id", membership.client_id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[Leads] Supabase fetch error:", error);
        setLeads([]);
        setError("Could not fetch leads for your client.");
      } else {
        setLeads(data || []);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  const mappedLeads = leads.map((lead) => ({
    id: lead.id,
    name: lead.customer_name,
    phone: lead.customer_phone,
    email: "", // Add this if you add the column!
    source: lead.source || "",
    status: lead.status || "new",
    lastMessage: lead.message || "",
    lastContact: lead.created_at
      ? new Date(lead.created_at).toLocaleString()
      : "",
    tags: lead.tags || [],
    ...lead,
  }));

  const filteredLeads = mappedLeads.filter((lead) => {
    const matchesSearch =
      (lead.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone || "").includes(searchQuery) ||
      (lead.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            Leads & Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all your customer conversations
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              All Leads ({loading ? "..." : filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-destructive">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Message</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>Loading leads…</TableCell>
                    </TableRow>
                  ) : filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>No leads found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {lead.phone}
                              </span>
                            </div>
                            {lead.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {lead.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              statusConfig[
                                lead.status as keyof typeof statusConfig
                              ]?.className ?? ""
                            }
                          >
                            {statusConfig[
                              lead.status as keyof typeof statusConfig
                            ]?.label ?? lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {lead.lastMessage}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {lead.lastContact}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {lead.tags && lead.tags.length > 0 ? (
                              lead.tags.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No tags
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedLead(lead)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Lead Details</DialogTitle>
                                  <DialogDescription>
                                    View and manage lead information
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedLead && (
                                  <div className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                          value={selectedLead.name}
                                          readOnly
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input
                                          value={selectedLead.phone}
                                          readOnly
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                          value={selectedLead.email || ""}
                                          readOnly
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Source</Label>
                                        <Input
                                          value={selectedLead.source || ""}
                                          readOnly
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                          defaultValue={selectedLead.status}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="new">
                                              New
                                            </SelectItem>
                                            <SelectItem value="contacted">
                                              Contacted
                                            </SelectItem>
                                            <SelectItem value="qualified">
                                              Qualified
                                            </SelectItem>
                                            <SelectItem value="converted">
                                              Converted
                                            </SelectItem>
                                            <SelectItem value="lost">
                                              Lost
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Last Contact</Label>
                                        <Input
                                          value={selectedLead.lastContact}
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Last Message</Label>
                                      <Textarea
                                        value={selectedLead.lastMessage}
                                        readOnly
                                        rows={3}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tags</Label>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedLead.tags &&
                                        selectedLead.tags.length > 0 ? (
                                          selectedLead.tags.map(
                                            (tag: string) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                              >
                                                {tag}
                                              </Badge>
                                            )
                                          )
                                        ) : (
                                          <span className="text-xs text-muted-foreground">
                                            No tags
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button className="flex-1">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Send Message
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent"
                                      >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Schedule Follow-up
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon">
                              <Reply className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Archive className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
