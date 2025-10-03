import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Moon, 
  Sun, 
  Palette, 
  Type, 
  Layout, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Users,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { 
  QuickStats, 
  UserList, 
  UsageAnalytics, 
  ActivityTimeline, 
  DataTable, 
  StatusIndicator 
} from './saas-components';

interface DesignSystemShowcaseProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function DesignSystemShowcase({ theme, onThemeChange }: DesignSystemShowcaseProps) {
  const [sliderValue, setSliderValue] = useState([50]);

  const colorPalette = [
    { name: 'Primary', class: 'bg-primary', textClass: 'text-primary-foreground', hex: '#186181', description: 'Teal Blue - Main brand color' },
    { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground', hex: '#769f86', description: 'Sage Green - Supporting brand color' },
    { name: 'Foreground', class: 'bg-foreground', textClass: 'text-background', hex: '#1d2759', description: 'Navy Blue - Text and dark elements' },
    { name: 'Success', class: 'bg-success', textClass: 'text-success-foreground', hex: '#769f86', description: 'Success states using sage green' },
    { name: 'Warning', class: 'bg-warning', textClass: 'text-warning-foreground', hex: '#d97706', description: 'Warning states' },
    { name: 'Destructive', class: 'bg-destructive', textClass: 'text-destructive-foreground', hex: '#dc2626', description: 'Error and destructive actions' },
    { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground', hex: '#f8f9fa', description: 'Subtle backgrounds and borders' },
    { name: 'Secondary', class: 'bg-secondary', textClass: 'text-secondary-foreground', hex: '#f7f9f8', description: 'Secondary backgrounds' }
  ];

  const sampleData = {
    users: 12543,
    revenue: 89432,
    growth: 23.5,
    conversion: 3.2
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold">Korrai Design System</h1>
              </div>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="saas">SaaS Demo</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Korrai Design System</CardTitle>
                  <CardDescription>
                    A comprehensive design system built for modern SaaS applications with consistent branding,
                    accessible components, and both light and dark theme support.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Palette className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Brand Colors</h3>
                      <p className="text-sm text-muted-foreground">Consistent color palette across all components</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Type className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Typography</h3>
                      <p className="text-sm text-muted-foreground">Clear hierarchy and readable text styles</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Layout className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Components</h3>
                      <p className="text-sm text-muted-foreground">Reusable UI components for rapid development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Design Principles</AlertTitle>
                  <AlertDescription>
                    Consistency, accessibility, and user experience are at the core of this design system.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Accessibility</AlertTitle>
                  <AlertDescription>
                    All components meet WCAG 2.1 AA standards for inclusive design.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Performance</AlertTitle>
                  <AlertDescription>
                    Optimized for fast loading and smooth interactions across all devices.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <div className="space-y-6">
              {/* Main Brand Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Core Brand Colors</CardTitle>
                  <CardDescription>
                    The three primary Korrai brand colors that define the visual identity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-3">
                      <div className="h-32 rounded-lg bg-[#186181] flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold">Teal Blue</span>
                      </div>
                      <div>
                        <p className="font-medium">Primary</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">#186181</code>
                        <p className="text-xs text-muted-foreground mt-1">Main brand color for primary actions</p>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="h-32 rounded-lg bg-[#769f86] flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold">Sage Green</span>
                      </div>
                      <div>
                        <p className="font-medium">Accent</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">#769f86</code>
                        <p className="text-xs text-muted-foreground mt-1">Supporting color for success states</p>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="h-32 rounded-lg bg-[#1d2759] flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold">Navy Blue</span>
                      </div>
                      <div>
                        <p className="font-medium">Dark</p>
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">#1d2759</code>
                        <p className="text-xs text-muted-foreground mt-1">Dark theme and text color</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Complete System Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>System Color Palette</CardTitle>
                  <CardDescription>
                    Complete color system including semantic colors and neutral tones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {colorPalette.map((color) => (
                      <div key={color.name} className="space-y-3">
                        <div className={`h-24 rounded-lg ${color.class} flex items-center justify-center shadow-sm border`}>
                          <span className={`font-medium ${color.textClass}`}>{color.name}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{color.name}</p>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{color.hex}</code>
                          </div>
                          <p className="text-xs text-muted-foreground">{color.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Brand Usage Tab */}
          <TabsContent value="usage">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Color Usage Guidelines</CardTitle>
                  <CardDescription>
                    Best practices for applying Korrai brand colors across interfaces
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Color Usage */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Teal Blue (#186181) - Primary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <Button className="w-full mb-2">Primary Action</Button>
                        <p className="text-sm text-muted-foreground">Use for main call-to-action buttons</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-primary hover:underline cursor-pointer">Primary Link</span>
                        </div>
                        <p className="text-sm text-muted-foreground">For important links and navigation</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Progress value={75} className="mb-2" />
                        <p className="text-sm text-muted-foreground">Progress indicators and charts</p>
                      </div>
                    </div>
                  </div>

                  {/* Sage Green Usage */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Sage Green (#769f86) - Accent/Success</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <Badge className="bg-success text-white mb-2">Success</Badge>
                        <p className="text-sm text-muted-foreground">Success states and positive feedback</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white mb-2">
                          Secondary Action
                        </Button>
                        <p className="text-sm text-muted-foreground">Secondary buttons and accents</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="w-full h-3 bg-accent/20 rounded mb-2">
                          <div className="w-3/4 h-full bg-accent rounded"></div>
                        </div>
                        <p className="text-sm text-muted-foreground">Charts and data visualization</p>
                      </div>
                    </div>
                  </div>

                  {/* Navy Blue Usage */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Navy Blue (#1d2759) - Dark Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-foreground mb-2">Heading Text</h4>
                        <p className="text-sm text-muted-foreground">Primary text color for headings</p>
                      </div>
                      <div className="p-4 bg-[#1d2759] text-white rounded-lg">
                        <p className="mb-2">Dark Theme Background</p>
                        <p className="text-sm opacity-80">Used for dark mode interfaces</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="border-l-4 border-[#1d2759] pl-3">
                          <p className="text-sm">Accent borders and dividers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Combinations */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recommended Color Combinations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-[#186181] to-[#769f86]">
                        <p className="text-white font-medium">Teal to Sage Gradient</p>
                        <p className="text-white/80 text-sm">For hero sections and feature highlights</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-[#1d2759]">
                        <div className="flex space-x-2">
                          <div className="w-4 h-4 bg-[#186181] rounded"></div>
                          <div className="w-4 h-4 bg-[#769f86] rounded"></div>
                          <div className="w-4 h-4 bg-white rounded"></div>
                        </div>
                        <p className="text-white text-sm mt-2">Dark theme with brand accents</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Scale</CardTitle>
                  <CardDescription>
                    Consistent text styles for clear hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h1>Heading 1 - Main page titles</h1>
                    <p className="text-muted-foreground">32px / 2rem - Medium weight</p>
                  </div>
                  <div>
                    <h2>Heading 2 - Section headers</h2>
                    <p className="text-muted-foreground">24px / 1.5rem - Medium weight</p>
                  </div>
                  <div>
                    <h3>Heading 3 - Subsection titles</h3>
                    <p className="text-muted-foreground">20px / 1.25rem - Medium weight</p>
                  </div>
                  <div>
                    <h4>Heading 4 - Card titles</h4>
                    <p className="text-muted-foreground">16px / 1rem - Medium weight</p>
                  </div>
                  <div>
                    <p>Body text - Regular paragraph content</p>
                    <p className="text-muted-foreground">16px / 1rem - Normal weight</p>
                  </div>
                  <div>
                    <p className="text-sm">Small text - Captions and metadata</p>
                    <p className="text-muted-foreground">14px / 0.875rem - Normal weight</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button size="sm">Small</Button>
                    <Button size="lg">Large</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badges & Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge className="bg-success text-white">Success</Badge>
                    <Badge className="bg-warning text-warning-foreground">Warning</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Avatars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Progress Bar</Label>
                    <Progress value={65} className="mt-2" />
                  </div>
                  <div>
                    <Label>Slider</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Components</CardTitle>
                  <CardDescription>
                    Complete form controls for data input and collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Enter your message" />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">I agree to the terms and conditions</Label>
                    </div>
                  </div>

                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="option1" />
                      <Label htmlFor="option1">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="option2" />
                      <Label htmlFor="option2">Option 2</Label>
                    </div>
                  </RadioGroup>

                  <Button className="w-full">Submit Form</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sampleData.users.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${sampleData.revenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+{sampleData.growth}% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sampleData.growth}%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{sampleData.conversion}%</div>
                    <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Dashboard Layout Example */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U{item}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">User {item} completed action</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SaaS Demo Tab */}
          <TabsContent value="saas">
            <div className="space-y-6">
              {/* Quick Stats */}
              <QuickStats />

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Wider */}
                <div className="lg:col-span-2 space-y-6">
                  <UsageAnalytics />
                  
                  <DataTable 
                    data={[
                      { name: 'John Doe', email: 'john@example.com', status: 'Active', plan: 'Pro', lastLogin: '2 hours ago' },
                      { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', plan: 'Basic', lastLogin: '1 day ago' },
                      { name: 'Bob Johnson', email: 'bob@example.com', status: 'Active', plan: 'Enterprise', lastLogin: '5 minutes ago' },
                      { name: 'Alice Brown', email: 'alice@example.com', status: 'Pending', plan: 'Pro', lastLogin: 'Never' }
                    ]}
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { 
                        key: 'status', 
                        label: 'Status',
                        render: (value) => (
                          <StatusIndicator 
                            status={value.toLowerCase() === 'active' ? 'success' : value.toLowerCase() === 'inactive' ? 'error' : 'pending'} 
                            text={value} 
                          />
                        )
                      },
                      { 
                        key: 'plan', 
                        label: 'Plan',
                        render: (value) => <Badge variant="outline">{value}</Badge>
                      },
                      { key: 'lastLogin', label: 'Last Login' }
                    ]}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <UserList 
                    users={[
                      { name: 'John Doe', email: 'john@korrai.com', role: 'Admin', status: 'success' },
                      { name: 'Jane Smith', email: 'jane@korrai.com', role: 'Editor', status: 'success' },
                      { name: 'Bob Johnson', email: 'bob@korrai.com', role: 'Viewer', status: 'warning' },
                      { name: 'Alice Brown', email: 'alice@korrai.com', role: 'Editor', status: 'pending' }
                    ]}
                  />

                  <ActivityTimeline 
                    activities={[
                      { title: 'New user registered', description: 'John Doe joined the workspace', time: '2 minutes ago', status: 'success' },
                      { title: 'Payment received', description: 'Monthly subscription renewed', time: '1 hour ago', status: 'success' },
                      { title: 'API limit warning', description: '80% of monthly quota used', time: '3 hours ago', status: 'warning' },
                      { title: 'Export completed', description: 'User data export finished', time: '1 day ago', status: 'success' },
                      { title: 'Failed login attempt', description: 'Security alert triggered', time: '2 days ago', status: 'error' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}