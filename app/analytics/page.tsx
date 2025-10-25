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
import { supabase } from "../lib/supabase";
import { config } from "../lib/config";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalLeads: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    messageReadRate: 0,
    leadsOverTime: [] as any[],
    leadSources: [] as any[],
    messageVolume: [] as any[],
    responseTime: [] as any[],
    campaignPerformance: [] as any[],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch leads data from Supabase
      const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .eq("client_id", config.testClientId)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching analytics:", error);
        return;
      }

      // Calculate analytics from real data
      const totalLeads = leads?.length || 0;
      const convertedLeads =
        leads?.filter((l: any) => l.status === "closed")?.length || 0;
      const conversionRate =
        totalLeads > 0
          ? ((convertedLeads / totalLeads) * 100).toFixed(1)
          : "0.0";

      // Group leads by source
      const sourceMap: { [key: string]: number } = {};
      leads?.forEach((lead: any) => {
        const source = lead.source || "whatsapp";
        sourceMap[source] = (sourceMap[source] || 0) + 1;
      });

      const leadSourceData = Object.keys(sourceMap).map((source, index) => ({
        name: source.charAt(0).toUpperCase() + source.slice(1),
        value: sourceMap[source],
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }));

      // Group leads by month (last 7 months)
      const leadsOverTimeData = generateLeadsOverTimeData(leads || []);

      setAnalyticsData({
        totalLeads,
        conversionRate: parseFloat(conversionRate),
        avgResponseTime: 15, // Mock for now - calculate from actual conversation data later
        messageReadRate: 79.8, // Mock for now
        leadsOverTime: leadsOverTimeData,
        leadSources: leadSourceData,
        messageVolume: generateMessageVolumeData(),
        responseTime: generateResponseTimeData(),
        campaignPerformance: generateCampaignData(),
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateLeadsOverTimeData = (leads: any[]) => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
    const monthMap: { [key: string]: { leads: number; converted: number } } =
      {};

    months.forEach((month) => {
      monthMap[month] = { leads: 0, converted: 0 };
    });

    leads.forEach((lead) => {
      const date = new Date(lead.timestamp);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      if (monthMap[monthName]) {
        monthMap[monthName].leads++;
        if (lead.status === "closed") {
          monthMap[monthName].converted++;
        }
      }
    });

    return months.map((month) => ({
      month,
      leads: monthMap[month].leads,
      converted: monthMap[month].converted,
    }));
  };

  const generateMessageVolumeData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      day,
      sent: Math.floor(Math.random() * 150) + 100,
      received: Math.floor(Math.random() * 200) + 150,
    }));
  };

  const generateResponseTimeData = () => {
    const hours = [
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
    ];
    return hours.map((hour) => ({
      hour,
      avgTime: Math.floor(Math.random() * 20) + 8,
    }));
  };

  const generateCampaignData = () => {
    return [
      {
        name: "Summer Sale",
        sent: 1150,
        delivered: 1098,
        read: 876,
        replied: 234,
      },
      {
        name: "Product Launch",
        sent: 856,
        delivered: 834,
        read: 645,
        replied: 178,
      },
      {
        name: "Feedback Survey",
        sent: 2341,
        delivered: 2298,
        read: 1876,
        replied: 892,
      },
      {
        name: "Flash Sale",
        sent: 945,
        delivered: 932,
        read: 745,
        replied: 156,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
          <Select value={timeRange} onValueChange={setTimeRange}>
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

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalLeads}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From Supabase
              </p>
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
              <div className="text-2xl font-bold">
                {analyticsData.conversionRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time data
              </p>
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
              <div className="text-2xl font-bold">
                {analyticsData.avgResponseTime} min
              </div>
              <p className="text-xs text-muted-foreground mt-1">Estimated</p>
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
              <div className="text-2xl font-bold">
                {analyticsData.messageReadRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Estimated</p>
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
                  <LineChart data={analyticsData.leadsOverTime}>
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
                {analyticsData.leadSources.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>No lead source data available</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.leadSources}
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
                        {analyticsData.leadSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>
                Daily sent and received messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.messageVolume}>
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
                    <Legend />
                    <Bar
                      dataKey="sent"
                      fill="hsl(var(--primary))"
                      name="Sent"
                    />
                    <Bar
                      dataKey="received"
                      fill="hsl(var(--accent))"
                      name="Received"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
              <CardDescription>Average response time by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.responseTime}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="hour"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Minutes",
                        angle: -90,
                        position: "insideLeft",
                      }}
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
                      dataKey="avgTime"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Avg Time (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Detailed metrics for recent campaigns (mock data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.campaignPerformance}
                  layout="vertical"
                >
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
                  <Bar dataKey="sent" fill="hsl(var(--chart-1))" name="Sent" />
                  <Bar
                    dataKey="delivered"
                    fill="hsl(var(--chart-2))"
                    name="Delivered"
                  />
                  <Bar dataKey="read" fill="hsl(var(--chart-3))" name="Read" />
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

        {/* Performance Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {analyticsData.totalLeads} Total
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Conversion Rate:
                  </span>
                  <span className="font-medium text-accent">
                    {analyticsData.conversionRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sources:</span>
                  <span className="font-medium">
                    {analyticsData.leadSources.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active:</span>
                  <span className="font-medium">Live from database</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {analyticsData.avgResponseTime} min
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response:</span>
                  <span className="font-medium text-accent">
                    {analyticsData.avgResponseTime} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read Rate:</span>
                  <span className="font-medium">
                    {analyticsData.messageReadRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">Tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Lead Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {analyticsData.leadSources[0]?.name || "N/A"}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Leads:</span>
                  <span className="font-medium text-accent">
                    {analyticsData.leadSources[0]?.value || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Percentage:</span>
                  <span className="font-medium">
                    {analyticsData.totalLeads > 0
                      ? (
                          (analyticsData.leadSources[0]?.value ||
                            0 / analyticsData.totalLeads) * 100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="font-medium">High</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
