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
  TrendingDown,
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
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Status config
const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  replied: {
    label: "Replied",
    className: "bg-primary text-primary-foreground",
  },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

export default function DashboardPage() {
  const [chartData, setChartData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      // Example: fetch last 7 days' leads counts.
      // Adjust table/fields as per your schema.
      const { data: leadsRows, error: chartError } = await supabase.rpc(
        "leads_per_day_last_week"
      ); // Call a Postgres function or replace with a select/aggregate
      setChartData(leadsRows || []);

      // Example: fetch 5 most recent messages
      const { data: messagesRows, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentMessages(messagesRows || []);
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

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
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Metrics Cards -- Replace with Supabase queries as needed */}
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
                {/* example: sum leads from chartData */}
                {chartData.reduce((sum, d) => sum + (d.leads || 0), 0)}
              </div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          {/* ...other cards—update with real data as desired */}
        </div>

        {/* Recent Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
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
                {recentMessages.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.phone}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {m.message}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusConfig[m.status]?.className || ""}
                      >
                        {statusConfig[m.status]?.label ?? m.status}
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
          </CardContent>
        </Card>

        {/* Leads Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Over Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
