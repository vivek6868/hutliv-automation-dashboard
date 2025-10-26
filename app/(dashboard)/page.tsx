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
import { TrendingUp, Users, Eye, Reply } from "lucide-react";
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

const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  replied: {
    label: "Replied",
    className: "bg-primary text-primary-foreground",
  },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
};

export default function DashboardPage() {
  const [leadsOverLast7Days, setLeadsOverLast7Days] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseBrowserClient();

      // 1. Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      // 2. Get client_id
      const { data: membership, error: memError } = await supabase
        .from("user_memberships")
        .select("client_id")
        .eq("user_id", user.id)
        .single();

      if (memError || !membership?.client_id) {
        setError("No client associated with this user.");
        setLoading(false);
        return;
      }
      const client_id = membership.client_id;

      // 3. Get lead counts for the last 7 days
      const today = new Date();
      const days = Array.from({ length: 7 }).map((_, idx) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - idx));
        const iso = d.toISOString().slice(0, 10);
        return { day: iso, leads: 0 };
      });

      // 4. Fetch leads for last 7 days and group by day
      const date7ago = new Date(today);
      date7ago.setDate(today.getDate() - 6);
      const { data: leadsData } = await supabase
        .from("leads")
        .select("id,created_at")
        .eq("client_id", client_id)
        .gte("created_at", date7ago.toISOString().slice(0, 10));

      if (leadsData) {
        leadsData.forEach((l) => {
          const dateKey = new Date(l.created_at).toISOString().slice(0, 10);
          const entry = days.find((d) => d.day === dateKey);
          if (entry) entry.leads += 1;
        });
      }
      setLeadsOverLast7Days(days);

      // 5. Fetch 5 most recent messages for this client
      const { data: recentMsgs } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", client_id)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentMessages(recentMsgs || []);
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-destructive">{error}</div>;

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads (last 7 days)
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leadsOverLast7Days.reduce((sum, d) => sum + (d.leads || 0), 0)}
              </div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>7-day total</span>
              </div>
            </CardContent>
          </Card>
          {/* Add more cards as you implement more metrics */}
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
                  <TableHead>Direction</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMessages.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Badge
                        color={
                          m.direction === "inbound" ? "secondary" : "default"
                        }
                      >
                        {m.direction}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{m.kind}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {m.body || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.sent_at
                        ? new Date(m.sent_at).toLocaleString()
                        : m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : "—"}
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
                <LineChart data={leadsOverLast7Days}>
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
