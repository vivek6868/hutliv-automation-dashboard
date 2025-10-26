"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Play, Pause, Edit, Trash2, Users, MessageSquare, Calendar, TrendingUp } from "lucide-react"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "active",
    type: "promotional",
    audience: 1284,
    sent: 1150,
    delivered: 1098,
    read: 876,
    replied: 234,
    scheduled: "2024-01-15 10:00 AM",
    message: "Get 50% off on all products this summer! Limited time offer. Shop now!",
  },
  {
    id: 2,
    name: "New Product Launch",
    status: "scheduled",
    type: "announcement",
    audience: 856,
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    scheduled: "2024-01-20 09:00 AM",
    message: "Introducing our latest product! Be the first to experience innovation.",
  },
  {
    id: 3,
    name: "Customer Feedback Survey",
    status: "completed",
    type: "survey",
    audience: 2341,
    sent: 2341,
    delivered: 2298,
    read: 1876,
    replied: 892,
    scheduled: "2024-01-10 02:00 PM",
    message: "We value your opinion! Please take 2 minutes to share your feedback.",
  },
  {
    id: 4,
    name: "Holiday Greetings",
    status: "draft",
    type: "greeting",
    audience: 3456,
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    scheduled: "Not scheduled",
    message: "Wishing you and your family a wonderful holiday season!",
  },
  {
    id: 5,
    name: "Flash Sale Alert",
    status: "active",
    type: "promotional",
    audience: 987,
    sent: 945,
    delivered: 932,
    read: 745,
    replied: 156,
    scheduled: "2024-01-16 06:00 PM",
    message: "Flash Sale! 24 hours only. Up to 70% off on selected items!",
  },
]

const statusConfig = {
  active: { label: "Active", className: "bg-accent text-accent-foreground" },
  scheduled: { label: "Scheduled", className: "bg-primary text-primary-foreground" },
  completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  draft: { label: "Draft", className: "bg-secondary text-secondary-foreground" },
  paused: { label: "Paused", className: "bg-destructive text-destructive-foreground" },
}

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<(typeof mockCampaigns)[0] | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
            <p className="text-sm text-muted-foreground">Create and manage your WhatsApp campaigns</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Set up a new WhatsApp marketing campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input id="campaign-name" placeholder="e.g., Summer Sale 2024" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-type">Campaign Type</Label>
                    <Select defaultValue="promotional">
                      <SelectTrigger id="campaign-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="survey">Survey</SelectItem>
                        <SelectItem value="greeting">Greeting</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="audience">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Contacts</SelectItem>
                        <SelectItem value="new">New Leads</SelectItem>
                        <SelectItem value="qualified">Qualified Leads</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                        <SelectItem value="custom">Custom Segment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your campaign message here..."
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Character count: 0 / 1000</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input id="schedule-date" type="date" />
                    <Input id="schedule-time" type="time" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Send Now
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Campaign Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">5 active, 3 completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,436</div>
              <p className="text-xs text-accent">+2,341 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivery Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.2%</div>
              <p className="text-xs text-muted-foreground">Above industry average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5%</div>
              <p className="text-xs text-accent">+3.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="capitalize">{campaign.type}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusConfig[campaign.status as keyof typeof statusConfig].className}
                  >
                    {statusConfig[campaign.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Audience</span>
                    <span className="font-medium">{campaign.audience.toLocaleString()}</span>
                  </div>
                  {campaign.sent > 0 && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sent</span>
                        <span className="font-medium">{campaign.sent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Delivered</span>
                        <span className="font-medium">{campaign.delivered.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Read</span>
                        <span className="font-medium">{campaign.read.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Replied</span>
                        <span className="font-medium text-accent">{campaign.replied.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scheduled</span>
                    <span className="font-medium">{campaign.scheduled}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Message Preview:</p>
                  <p className="line-clamp-2 text-sm">{campaign.message}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Campaign Details</DialogTitle>
                        <DialogDescription>View and edit campaign information</DialogDescription>
                      </DialogHeader>
                      {selectedCampaign && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Campaign Name</Label>
                            <Input value={selectedCampaign.name} />
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select defaultValue={selectedCampaign.type}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="promotional">Promotional</SelectItem>
                                  <SelectItem value="announcement">Announcement</SelectItem>
                                  <SelectItem value="survey">Survey</SelectItem>
                                  <SelectItem value="greeting">Greeting</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select defaultValue={selectedCampaign.status}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="paused">Paused</SelectItem>
                                  <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea value={selectedCampaign.message} rows={5} />
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Performance</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Sent:</span>
                                  <span className="font-medium">{selectedCampaign.sent}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Delivered:</span>
                                  <span className="font-medium">{selectedCampaign.delivered}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Read:</span>
                                  <span className="font-medium">{selectedCampaign.read}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Replied:</span>
                                  <span className="font-medium text-accent">{selectedCampaign.replied}</span>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Rates</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Delivery:</span>
                                  <span className="font-medium">
                                    {selectedCampaign.sent > 0
                                      ? ((selectedCampaign.delivered / selectedCampaign.sent) * 100).toFixed(1)
                                      : 0}
                                    %
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Read:</span>
                                  <span className="font-medium">
                                    {selectedCampaign.delivered > 0
                                      ? ((selectedCampaign.read / selectedCampaign.delivered) * 100).toFixed(1)
                                      : 0}
                                    %
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Response:</span>
                                  <span className="font-medium text-accent">
                                    {selectedCampaign.read > 0
                                      ? ((selectedCampaign.replied / selectedCampaign.read) * 100).toFixed(1)
                                      : 0}
                                    %
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1">Save Changes</Button>
                            <Button variant="outline" className="bg-transparent">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  {campaign.status === "active" ? (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : campaign.status === "scheduled" || campaign.status === "draft" ? (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Megaphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  )
}
