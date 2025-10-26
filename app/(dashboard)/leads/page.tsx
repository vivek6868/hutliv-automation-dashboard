"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Search, Filter, Eye, Reply, Archive, Phone, Mail, Calendar, MessageSquare } from "lucide-react"

// Mock data for leads
const mockLeads = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    source: "WhatsApp",
    status: "new",
    lastMessage: "Hi, I'm interested in your product...",
    lastContact: "2 mins ago",
    tags: ["Hot Lead", "Product Inquiry"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    email: "priya.sharma@email.com",
    source: "Website",
    status: "contacted",
    lastMessage: "Can you send me the pricing details?",
    lastContact: "15 mins ago",
    tags: ["Pricing"],
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 98765 43212",
    email: "amit.patel@email.com",
    source: "WhatsApp",
    status: "qualified",
    lastMessage: "Thank you for the information!",
    lastContact: "1 hour ago",
    tags: ["Qualified", "Follow-up"],
  },
  {
    id: 4,
    name: "Sneha Reddy",
    phone: "+91 98765 43213",
    email: "sneha.reddy@email.com",
    source: "Facebook",
    status: "new",
    lastMessage: "Is this still available?",
    lastContact: "2 hours ago",
    tags: ["Product Inquiry"],
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "+91 98765 43214",
    email: "vikram.singh@email.com",
    source: "WhatsApp",
    status: "contacted",
    lastMessage: "I need help with my order",
    lastContact: "3 hours ago",
    tags: ["Support"],
  },
  {
    id: 6,
    name: "Ananya Iyer",
    phone: "+91 98765 43215",
    email: "ananya.iyer@email.com",
    source: "Instagram",
    status: "qualified",
    lastMessage: "When can we schedule a demo?",
    lastContact: "5 hours ago",
    tags: ["Demo Request", "Hot Lead"],
  },
  {
    id: 7,
    name: "Karthik Menon",
    phone: "+91 98765 43216",
    email: "karthik.menon@email.com",
    source: "WhatsApp",
    status: "converted",
    lastMessage: "Payment completed successfully",
    lastContact: "1 day ago",
    tags: ["Customer", "Converted"],
  },
  {
    id: 8,
    name: "Deepa Nair",
    phone: "+91 98765 43217",
    email: "deepa.nair@email.com",
    source: "Website",
    status: "lost",
    lastMessage: "Not interested at the moment",
    lastContact: "2 days ago",
    tags: ["Lost"],
  },
]

const statusConfig = {
  new: { label: "New", className: "bg-accent text-accent-foreground" },
  contacted: { label: "Contacted", className: "bg-primary text-primary-foreground" },
  qualified: { label: "Qualified", className: "bg-secondary text-secondary-foreground" },
  converted: { label: "Converted", className: "bg-chart-5 text-foreground" },
  lost: { label: "Lost", className: "bg-muted text-muted-foreground" },
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<(typeof mockLeads)[0] | null>(null)

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter
    return matchesSearch && matchesStatus && matchesSource
  })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Leads & Messages</h1>
          <p className="text-sm text-muted-foreground">Manage all your customer conversations</p>
        </div>
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

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{lead.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusConfig[lead.status as keyof typeof statusConfig].className}
                      >
                        {statusConfig[lead.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{lead.lastMessage}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.lastContact}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedLead(lead)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Lead Details</DialogTitle>
                              <DialogDescription>View and manage lead information</DialogDescription>
                            </DialogHeader>
                            {selectedLead && (
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={selectedLead.name} readOnly />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={selectedLead.phone} readOnly />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={selectedLead.email} readOnly />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Source</Label>
                                    <Input value={selectedLead.source} readOnly />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select defaultValue={selectedLead.status}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="converted">Converted</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Last Contact</Label>
                                    <Input value={selectedLead.lastContact} readOnly />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Last Message</Label>
                                  <Textarea value={selectedLead.lastMessage} readOnly rows={3} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Tags</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedLead.tags.map((tag) => (
                                      <Badge key={tag} variant="outline">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Send Message
                                  </Button>
                                  <Button variant="outline" className="flex-1 bg-transparent">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
