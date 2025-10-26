"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseBrowserClient();

      // 1. Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not signed in");
        setLeads([]);
        setCampaigns([]);
        setLoading(false);
        return;
      }

      // 2. Get client_id for this user
      const { data: membership, error: memError } = await supabase
        .from("user_memberships")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (memError || !membership?.client_id) {
        setError("No client associated. Contact admin.");
        setLeads([]);
        setCampaigns([]);
        setLoading(false);
        return;
      }

      // 3. Fetch leads for this client
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .eq("client_id", membership.client_id);

      // 4. Fetch campaigns for this client
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("client_id", membership.client_id);

      setLeads(leadsData || []);
      setCampaigns(campaignsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // ==== Example mappings for cards ====
  const totalLeads = leads.length;
  // Fake conversion/response for now (implement with better logic later)
  const conversionRate = totalLeads
    ? Math.round(
        (leads.filter((l) => l.status === "converted").length / totalLeads) *
          1000
      ) / 10
    : 0;
  const avgResponseTime = "15 min"; // Needs messages table with timestamps to compute
  const messageReadRate = campaigns.length
    ? `${
        Math.round(
          (campaigns.reduce((acc, c) => acc + c.total_read, 0) /
            Math.max(
              1,
              campaigns.reduce((acc, c) => acc + c.total_delivered, 0)
            )) *
            1000
        ) / 10
      }%`
    : "0%";

  // === DYNAMIC line/bar/pie data examples (simple GROUPs, you can advance from here) ===
  // 1. Leads over time (by created_at month)
  const leadsByMonth = (() => {
    const monthly: { [k: string]: { leads: number; converted: number } } = {};
    leads.forEach((l) => {
      const date = new Date(l.created_at);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (!monthly[label]) monthly[label] = { leads: 0, converted: 0 };
      monthly[label].leads += 1;
      if (l.status === "converted") monthly[label].converted += 1;
    });
    return Object.keys(monthly)
      .sort()
      .map((month) => ({ month, ...monthly[month] }));
  })();

  // 2. Lead sources (if you have "source" in leads table)
  const leadSources = (() => {
    const bySource: { [s: string]: number } = {};
    leads.forEach((l) => {
      if (l.source) bySource[l.source] = (bySource[l.source] || 0) + 1;
    });
    return Object.entries(bySource).map(([name, value]) => ({
      name,
      value,
      color: undefined,
    }));
  })();

  // 3. Campaign performance - pull stats from campaign rows directly
  const campaignPerformance = campaigns.map((c) => ({
    name: c.campaign_name,
    sent: c.total_sent || 0,
    delivered: c.total_delivered || 0,
    read: c.total_read || 0,
    replied: c.replied || 0,
  }));

  // The rest of your charts can be similarly mapped!

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your business performance and insights
            </p>
          </div>
          <Select defaultValue="7days" disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      <div className="flex-1 space-y-6 p-6">
        {loading ? (
          <div className="text-xl">Loading analytics…</div>
        ) : error ? (
          <div className="text-destructive text-xl">{error}</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Leads
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Conversion Rate
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Response Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgResponseTime}</div>
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <TrendingDown className="h-3 w-3" />
                    <span>-5 min from last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Message Read Rate
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{messageReadRate}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Leads Over Time</CardTitle>
                  <CardDescription>
                    Monthly lead generation and conversion trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={leadsByMonth}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis
                          dataKey="month"
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
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="leads"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          name="Total Leads"
                        />
                        <Line
                          type="monotone"
                          dataKey="converted"
                          stroke="hsl(var(--accent))"
                          strokeWidth={2}
                          name="Converted"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                  <CardDescription>
                    Distribution of leads by source channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadSources}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {leadSources.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color || "#8884d8"}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Row 2, Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Detailed metrics for recent campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignPerformance} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        type="number"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
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
                      <Legend />
                      <Bar
                        dataKey="sent"
                        fill="hsl(var(--chart-1))"
                        name="Sent"
                      />
                      <Bar
                        dataKey="delivered"
                        fill="hsl(var(--chart-2))"
                        name="Delivered"
                      />
                      <Bar
                        dataKey="read"
                        fill="hsl(var(--chart-3))"
                        name="Read"
                      />
                      <Bar
                        dataKey="replied"
                        fill="hsl(var(--accent))"
                        name="Replied"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            {/* You can add more analytics as desired, pulling from campaigns/leads/messages */}
          </>
        )}
      </div>
    </div>
  );
}
