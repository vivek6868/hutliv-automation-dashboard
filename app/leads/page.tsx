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
  Calendar,
  MessageSquare,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { config } from "../lib/config";

const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  replied: {
    label: "Replied",
    className: "bg-primary text-primary-foreground",
  },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  message: string;
  timestamp: string;
  status: "new" | "replied" | "closed";
  source: string;
  notes?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("client_id", config.testClientId)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) {
        console.error("Error updating lead:", error);
        return;
      }

      // Refresh leads after update
      await fetchLeads();

      // Update selected lead if it's the one being updated
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as any });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer_phone?.includes(searchQuery) ||
      lead.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leads...</p>
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
          <h1 className="text-2xl font-semibold text-foreground">
            Leads & Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all your customer conversations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLeads}>
          Refresh
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
                  placeholder="Search by name, phone, or message..."
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
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  sourceFilter !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Add test data in Supabase or connect WhatsApp to start receiving leads"}
                </p>
                <Button variant="outline" onClick={fetchLeads}>
                  Refresh Data
                </Button>
              </div>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.customer_name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {lead.customer_phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {lead.source || "whatsapp"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusConfig[lead.status]?.className || ""}
                        >
                          {statusConfig[lead.status]?.label || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {lead.message || "No message"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTimeAgo(lead.timestamp)}
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
                                        value={
                                          selectedLead.customer_name ||
                                          "Unknown"
                                        }
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Phone</Label>
                                      <Input
                                        value={selectedLead.customer_phone}
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Source</Label>
                                      <Input
                                        value={
                                          selectedLead.source || "whatsapp"
                                        }
                                        readOnly
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                        value={selectedLead.status}
                                        onValueChange={(value) =>
                                          updateLeadStatus(
                                            selectedLead.id,
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">
                                            New
                                          </SelectItem>
                                          <SelectItem value="replied">
                                            Replied
                                          </SelectItem>
                                          <SelectItem value="closed">
                                            Closed
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label>Timestamp</Label>
                                      <Input
                                        value={new Date(
                                          selectedLead.timestamp
                                        ).toLocaleString()}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                      value={
                                        selectedLead.message || "No message"
                                      }
                                      readOnly
                                      rows={4}
                                    />
                                  </div>
                                  {selectedLead.notes && (
                                    <div className="space-y-2">
                                      <Label>Notes</Label>
                                      <Textarea
                                        value={selectedLead.notes}
                                        readOnly
                                        rows={3}
                                      />
                                    </div>
                                  )}
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
