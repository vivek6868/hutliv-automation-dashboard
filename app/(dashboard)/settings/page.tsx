"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, User, Building2, MessageSquare, Shield, CreditCard, Save } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    newLeads: true,
    messages: true,
    campaigns: false,
    reports: true,
  })

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="business">
              <Building2 className="mr-2 h-4 w-4" />
              Business
            </TabsTrigger>
            <TabsTrigger value="whatsapp">
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback>BO</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="bg-transparent">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" defaultValue="Business" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" defaultValue="Owner" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" defaultValue="owner@business.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    defaultValue="Business owner passionate about customer engagement and growth."
                  />
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Manage your business details and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" placeholder="My Business" defaultValue="My Business" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="retail">
                      <SelectTrigger id="industry">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      placeholder="contact@business.com"
                      defaultValue="contact@mybusiness.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone</Label>
                    <Input id="businessPhone" type="tel" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your business address..."
                    rows={3}
                    defaultValue="123 Business Street, Mumbai, Maharashtra 400001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" placeholder="https://mybusiness.com" defaultValue="" />
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>Configure your WhatsApp Business API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                  <Input id="whatsappNumber" type="tel" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" type="password" placeholder="Enter your API key" defaultValue="••••••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://your-domain.com/webhook"
                    defaultValue="https://mybusiness.com/webhook"
                  />
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Auto-Reply Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Auto-Reply</Label>
                      <p className="text-sm text-muted-foreground">Automatically respond to new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autoReplyMessage">Auto-Reply Message</Label>
                    <Textarea
                      id="autoReplyMessage"
                      placeholder="Enter your auto-reply message..."
                      rows={3}
                      defaultValue="Thank you for contacting us! We'll get back to you shortly."
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Business Hours</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">Opening Time</Label>
                      <Input id="openTime" type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closeTime">Closing Time</Label>
                      <Input id="closeTime" type="time" defaultValue="18:00" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Out of Hours Auto-Reply</Label>
                      <p className="text-sm text-muted-foreground">Send automatic replies outside business hours</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Leads</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you receive new leads</p>
                    </div>
                    <Switch
                      checked={notifications.newLeads}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newLeads: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Messages</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Campaign Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about campaign performance</p>
                    </div>
                    <Switch
                      checked={notifications.campaigns}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, campaigns: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly performance reports via email</p>
                    </div>
                    <Switch
                      checked={notifications.reports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, reports: checked })}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">Notification Email</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="notifications@business.com"
                      defaultValue="owner@business.com"
                    />
                  </div>
                </div>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Mumbai, India • Chrome on Windows</p>
                      </div>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">Unlimited leads and campaigns</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹2,999</p>
                      <p className="text-sm text-muted-foreground">per month</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Next billing date: February 15, 2024</p>
                    <Button variant="outline" className="bg-transparent">
                      Change Plan
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Payment Method</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-16 items-center justify-center rounded border bg-background">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Update
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Billing History</h3>
                  <div className="space-y-2">
                    {[
                      { date: "Jan 15, 2024", amount: "₹2,999", status: "Paid" },
                      { date: "Dec 15, 2023", amount: "₹2,999", status: "Paid" },
                      { date: "Nov 15, 2023", amount: "₹2,999", status: "Paid" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-muted-foreground">Pro Plan</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-medium">{invoice.amount}</p>
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
