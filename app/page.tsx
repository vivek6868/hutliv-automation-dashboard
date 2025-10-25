"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  TrendingUp,
  Users,
  MessageSquare,
  Megaphone,
  Eye,
  Reply,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "./lib/supabase";
import { config } from "./lib/config";

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
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newToday: 0,
    messagesWeek: 0,
    activeCampaigns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all leads for this client using config
      const { data: allLeads, error } = await supabase
        .from("leads")
        .select("*")
        .eq("client_id", config.testClientId)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        return;
      }

      // Recent leads for table (last 10)
      setLeads((allLeads || []).slice(0, 10));

      // Calculate statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const newToday = (allLeads || []).filter((lead: any) => {
        const leadDate = new Date(lead.timestamp);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === today.getTime();
      }).length;

      const messagesThisWeek = (allLeads || []).filter((lead: any) => {
        return new Date(lead.timestamp) >= weekAgo;
      }).length;

      setStats({
        totalLeads: allLeads?.length || 0,
        newToday: newToday,
        messagesWeek: messagesThisWeek,
        activeCampaigns: 0, // Will be updated when campaigns table is populated
      });

      // Generate chart data (last 7 days)
      const chartDataMap: { [key: string]: number } = {};
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const dayName = days[date.getDay()];
        chartDataMap[dayName] = 0;
      }

      (allLeads || []).forEach((lead: any) => {
        const leadDate = new Date(lead.timestamp);
        const dayName = days[leadDate.getDay()];

        // Only count leads from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (leadDate >= sevenDaysAgo && chartDataMap.hasOwnProperty(dayName)) {
          chartDataMap[dayName]++;
        }
      });

      const formattedChartData = Object.keys(chartDataMap).map((day) => ({
        day: day,
        leads: chartDataMap[day],
      }));

      setChartData(formattedChartData);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            Welcome back, Business Owner
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your business today
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          Refresh
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New Leads Today
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newToday}</div>
              <div className="flex items-center gap-1 text-xs text-accent mt-1">
                {stats.newToday > 0 && <TrendingUp className="h-3 w-3" />}
                <span>Live from database</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Messages This Week
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messagesWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Campaigns
              </CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add test data in Supabase or connect your WhatsApp to start
                  receiving leads.
                </p>
                <Button variant="outline" onClick={fetchData}>
                  Refresh Data
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Message Preview</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.customer_name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.customer_phone}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">
                        {lead.message || "No message"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTimeAgo(lead.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusConfig[lead.status]?.className || ""}
                        >
                          {statusConfig[lead.status]?.label || lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Reply className="h-4 w-4" />
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

        {/* Leads Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 || chartData.every((d) => d.leads === 0) ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No lead data available for chart</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="day"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
