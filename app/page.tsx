import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { TrendingUp, TrendingDown, Users, MessageSquare, Megaphone, Eye, Reply } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the chart
const chartData = [
  { day: "Mon", leads: 12 },
  { day: "Tue", leads: 19 },
  { day: "Wed", leads: 15 },
  { day: "Thu", leads: 25 },
  { day: "Fri", leads: 22 },
  { day: "Sat", leads: 30 },
  { day: "Sun", leads: 28 },
]

// Mock data for recent messages
const recentMessages = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    message: "Hi, I'm interested in your product...",
    time: "2 mins ago",
    status: "new" as const,
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    message: "Can you send me the pricing details?",
    time: "15 mins ago",
    status: "replied" as const,
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 98765 43212",
    message: "Thank you for the information!",
    time: "1 hour ago",
    status: "closed" as const,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    phone: "+91 98765 43213",
    message: "Is this still available?",
    time: "2 hours ago",
    status: "new" as const,
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "+91 98765 43214",
    message: "I need help with my order",
    time: "3 hours ago",
    status: "replied" as const,
  },
]

const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  replied: { label: "Replied", className: "bg-primary text-primary-foreground" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, Business Owner</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your business today</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Leads Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <div className="flex items-center gap-1 text-xs text-accent">
                <TrendingUp className="h-3 w-3" />
                <span>+8 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages This Week</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <div className="flex items-center gap-1 text-xs text-destructive">
                <TrendingDown className="h-3 w-3" />
                <span>-3.2% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">3 scheduled, 5 running</p>
            </CardContent>
          </Card>
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
                {recentMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="text-muted-foreground">{message.phone}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{message.message}</TableCell>
                    <TableCell className="text-muted-foreground">{message.time}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusConfig[message.status].className}>
                        {statusConfig[message.status].label}
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
  )
}
