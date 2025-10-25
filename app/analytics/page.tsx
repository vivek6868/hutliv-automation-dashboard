"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, Eye, Clock, Target } from "lucide-react"
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
} from "recharts"

// Mock data for charts
const leadsOverTimeData = [
  { month: "Jul", leads: 245, converted: 45 },
  { month: "Aug", leads: 312, converted: 67 },
  { month: "Sep", leads: 289, converted: 54 },
  { month: "Oct", leads: 398, converted: 89 },
  { month: "Nov", leads: 456, converted: 102 },
  { month: "Dec", leads: 523, converted: 118 },
  { month: "Jan", leads: 612, converted: 145 },
]

const messageVolumeData = [
  { day: "Mon", sent: 145, received: 234 },
  { day: "Tue", sent: 189, received: 298 },
  { day: "Wed", sent: 167, received: 256 },
  { day: "Thu", sent: 223, received: 334 },
  { day: "Fri", sent: 198, received: 289 },
  { day: "Sat", sent: 134, received: 178 },
  { day: "Sun", sent: 112, received: 145 },
]

const leadSourceData = [
  { name: "WhatsApp", value: 45, color: "hsl(var(--accent))" },
  { name: "Website", value: 25, color: "hsl(var(--primary))" },
  { name: "Facebook", value: 15, color: "hsl(var(--secondary))" },
  { name: "Instagram", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--muted))" },
]

const campaignPerformanceData = [
  { name: "Summer Sale", sent: 1150, delivered: 1098, read: 876, replied: 234 },
  { name: "Product Launch", sent: 856, delivered: 834, read: 645, replied: 178 },
  { name: "Feedback Survey", sent: 2341, delivered: 2298, read: 1876, replied: 892 },
  { name: "Flash Sale", sent: 945, delivered: 932, read: 745, replied: 156 },
]

const responseTimeData = [
  { hour: "9 AM", avgTime: 12 },
  { hour: "10 AM", avgTime: 8 },
  { hour: "11 AM", avgTime: 15 },
  { hour: "12 PM", avgTime: 22 },
  { hour: "1 PM", avgTime: 28 },
  { hour: "2 PM", avgTime: 18 },
  { hour: "3 PM", avgTime: 14 },
  { hour: "4 PM", avgTime: 10 },
  { hour: "5 PM", avgTime: 16 },
]

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your business performance and insights</p>
          </div>
          <Select defaultValue="7days">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,234</div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+18.2% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.7%</div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+2.4% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 min</div>
              <div className="flex items-center gap-1 text-xs text-destructive">
                <TrendingDown className="h-3 w-3" />
                <span>-5 min from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Message Read Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">79.8%</div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+4.1% from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Leads Over Time</CardTitle>
              <CardDescription>Monthly lead generation and conversion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadsOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
              <CardDescription>Distribution of leads by source channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Message Volume</CardTitle>
              <CardDescription>Daily sent and received messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={messageVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sent" fill="hsl(var(--primary))" name="Sent" />
                    <Bar dataKey="received" fill="hsl(var(--accent))" name="Received" />
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
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="hour" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
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
            <CardDescription>Detailed metrics for recent campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
                  <Bar dataKey="delivered" fill="hsl(var(--chart-2))" name="Delivered" />
                  <Bar dataKey="read" fill="hsl(var(--chart-3))" name="Read" />
                  <Bar dataKey="replied" fill="hsl(var(--accent))" name="Replied" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Performing Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">Feedback Survey</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Rate:</span>
                  <span className="font-medium text-accent">47.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Rate:</span>
                  <span className="font-medium">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Read Rate:</span>
                  <span className="font-medium">81.6%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Best Response Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">10 AM - 11 AM</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response:</span>
                  <span className="font-medium text-accent">8 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satisfaction:</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Lead Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">WhatsApp</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Leads:</span>
                  <span className="font-medium text-accent">1,455</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversion:</span>
                  <span className="font-medium">28.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quality Score:</span>
                  <span className="font-medium">9.2/10</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
