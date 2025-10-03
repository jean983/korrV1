import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  LogOut,
  Settings as SettingsIcon,
  FileText,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  FolderOpen,
  Plus,
  ClipboardList
} from 'lucide-react';
import korraiLogo from 'figma:asset/bd5bdf8d244c8b4fc63b5124966283973e9beb45.png';
import { ChatInterface } from './chat-interface';
import { ProjectMap } from './project-map';
import { ProjectSettings } from './project-settings';
import { ActivityDialog } from './activity-dialog';
import { NotificationsPopover } from './notifications-popover';
import { mockProjects, mockChatHistory, mockUser, ChatMessage, Asset, Project, Activity } from '../lib/mock-data';
import { useNotifications } from '../lib/notification-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface DashboardProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNavigateToActivities?: () => void;
  onNavigateToAccountSettings?: () => void;
}

export function Dashboard({ onLogout, theme, onThemeChange, onNavigateToActivities, onNavigateToAccountSettings }: DashboardProps) {
  const { addNotification } = useNotifications();
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [chatContext, setChatContext] = useState<string>(`Project: ${mockProjects[0].name}`);
  const [showSettings, setShowSettings] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: generateMockResponse(content, selectedProject, chatContext),
        timestamp: new Date(),
        sources: [`${selectedProject.name} Data`, 'Eurocode 7: Geotechnical Design']
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleAssetSelect = (asset: Asset) => {
    const contextMessage = `${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}: ${asset.name}`;
    setChatContext(contextMessage);
    const message = `Show me detailed analysis for ${asset.name}`;
    handleSendMessage(message);
  };

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setChatContext(`Project: ${project.name}`);
      // Add system message about context change
      const contextChangeMessage: ChatMessage = {
        id: `msg-${Date.now()}-context`,
        role: 'assistant',
        content: `Context switched to project: **${project.name}**\n\nI now have access to ${project.assets.length} assets including boreholes, monitoring points, and infrastructure data. How can I help you with this project?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextChangeMessage]);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setSelectedProject(updatedProject);
    // In a real app, this would update the project in the database
  };

  const handleFileUpload = (file: File) => {
    // In a real app, this would upload the file to the server and update the project
    const systemMessage: ChatMessage = {
      id: `msg-${Date.now()}-file`,
      role: 'assistant',
      content: `File "${file.name}" has been added to project "${selectedProject.name}". I can now reference this document in our conversation. How would you like me to analyze it?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleContextChange = (newContextMessage: string) => {
    // Add system message about context change
    const contextChangeMessage: ChatMessage = {
      id: `msg-${Date.now()}-context`,
      role: 'assistant',
      content: `✨ ${newContextMessage}\\n\\nI've updated my focus to provide more relevant insights. What would you like to know?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, contextChangeMessage]);
  };

  const handleDigDeeper = (assetName: string) => {
    // Find the asset data
    const asset = selectedProject.assets.find(a => a.name === assetName);
    
    // Create dig deeper message with data tables
    const digDeeperMessage: ChatMessage = {
      id: `msg-${Date.now()}-digdeeper`,
      role: 'assistant',
      content: `Digging deeper into ${assetName}`,
      timestamp: new Date(),
      digDeeper: {
        sourceName: assetName,
        tables: asset ? generateAssetDataTables(asset) : [],
        recommendedQuestions: [
          `What are the key geotechnical parameters for ${assetName}?`,
          `Analyze the soil conditions at ${assetName}`,
          `What are the foundation design recommendations for this location?`,
          `Compare this data with similar assets in the project`
        ]
      }
    };
    
    setMessages(prev => [...prev, digDeeperMessage]);
  };

  const handleCreateActivity = (activity: Activity) => {
    // In a real app, this would save the activity to the database
    setIsActivityDialogOpen(false);
    
    // Add a system message about activity creation
    const systemMessage: ChatMessage = {
      id: `msg-${Date.now()}-activity`,
      role: 'assistant',
      content: `Activity "${activity.name}" has been created for project "${selectedProject.name}". I've automatically generated a checklist with ${activity.checklist.length} items based on the ${activity.activityType} playbook. You can manage this activity in the Activities page.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
    
    // Add notification
    addNotification({
      title: 'Activity Created',
      message: `"${activity.name}" has been created for ${selectedProject.name}`,
      type: 'success',
      action: 'View Activities',
      projectId: selectedProject.id
    });
  };

  // Show settings view if settings is active
  if (showSettings) {
    return (
      <ProjectSettings 
        project={selectedProject}
        onBack={() => setShowSettings(false)}
        onUpdateProject={handleUpdateProject}
        theme={theme}
        onThemeChange={onThemeChange}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-card flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Logo and Project Selector */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <img src={korraiLogo} alt="KorrAI" className="h-6 w-auto" />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Select value={selectedProject.id} onValueChange={handleProjectChange}>
                <SelectTrigger className="w-[200px] sm:w-[280px] bg-muted/50 hover:bg-muted transition-colors pr-8">
                  <div className="flex items-center space-x-2 w-full pr-2">
                    <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{selectedProject.name}</p>
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="w-[300px] sm:w-[400px]">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Select Project
                  </div>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="cursor-pointer">
                      <div className="flex items-start space-x-3 py-1">
                        <FolderOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{project.name}</p>
                          <p className="text-xs text-muted-foreground">{project.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs h-5 ${
                                project.status === 'Active' 
                                  ? 'bg-success/10 text-success border-success/20' 
                                  : project.status === 'Completed'
                                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                  : project.status === 'Planned'
                                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                  : 'bg-muted text-muted-foreground border-border'
                              }`}
                            >
                              {project.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{project.assets.length} assets</span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(true)}
                className="h-9 w-9 flex-shrink-0"
              >
                <SettingsIcon className="w-4 h-4" />
              </Button>
              <Badge 
                variant="outline" 
                className={`hidden sm:inline-flex ${
                  selectedProject.status === 'Active' 
                    ? 'bg-success/10 text-success border-success/20' 
                    : selectedProject.status === 'Completed'
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    : selectedProject.status === 'Planned'
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {selectedProject.status}
              </Badge>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button onClick={() => setIsActivityDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => onNavigateToActivities?.()}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Activities
              </Button>

              <NotificationsPopover />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium">{mockUser.name}</p>
                      <p className="text-xs text-muted-foreground">{mockUser.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{mockUser.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{mockUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onNavigateToAccountSettings}>
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Project Info */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Current Project</label>
              <Select value={selectedProject.id} onValueChange={handleProjectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowSettings(true)}
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Project Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel - Chat Interface */}
        <div className="flex-1 border-r">
          <Card className="h-full rounded-none border-0 shadow-none">
            <ChatInterface 
              messages={messages} 
              onSendMessage={handleSendMessage}
              context={chatContext}
              assets={selectedProject.assets}
              projectName={selectedProject.name}
              onFileUpload={handleFileUpload}
              onContextChange={handleContextChange}
              onDigDeeper={handleDigDeeper}
            />
          </Card>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 hidden md:block">
          <Card className="h-full rounded-none border-0 shadow-none">
            <ProjectMap 
              project={selectedProject} 
              onAssetSelect={handleAssetSelect}
              onDigDeeper={handleDigDeeper}
            />
          </Card>
        </div>
      </div>

      {/* Mobile Map Toggle (shown at bottom on mobile) */}
      <div className="md:hidden border-t p-2 flex-shrink-0">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {/* Could toggle a modal/sheet with map */}}
        >
          View Site Map ({selectedProject.assets.length} assets)
        </Button>
      </div>

      {/* Activity Creation Dialog */}
      <ActivityDialog
        open={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        onCreateActivity={handleCreateActivity}
      />
    </div>
  );
}

// Helper function to generate data tables from asset
function generateAssetDataTables(asset: Asset) {
  const tables: { title: string; data: { label: string; value: string }[] }[] = [];
  
  // Basic Info Table
  tables.push({
    title: 'Asset Information',
    data: [
      { label: 'Name', value: asset.name },
      { label: 'Type', value: asset.type },
      { label: 'Location', value: asset.location.address },
      { label: 'Coordinates', value: `${asset.location.lat.toFixed(4)}°N, ${Math.abs(asset.location.lng).toFixed(4)}°W` }
    ]
  });
  
  // Type-specific data
  if (asset.type === 'borehole') {
    const borehole = asset as import('../lib/mock-data').BoreholeData;
    tables.push({
      title: 'Borehole Data',
      data: [
        { label: 'Total Depth', value: `${borehole.depth}m` },
        { label: 'Investigation Date', value: borehole.date },
        { label: 'Soil Layers', value: `${borehole.soilLayers.length} layers` }
      ]
    });
    
    // Add first soil layer details
    if (borehole.soilLayers.length > 0) {
      const layer = borehole.soilLayers[0];
      tables.push({
        title: 'Top Soil Layer',
        data: [
          { label: 'Depth Range', value: layer.depth },
          { label: 'Classification', value: layer.classification },
          { label: 'SPT N-Value', value: layer.nValue.toString() },
          { label: 'Moisture Content', value: `${layer.moisture}%` }
        ]
      });
    }
  } else if (asset.type === 'monitoring') {
    const monitoring = asset as import('../lib/mock-data').MonitoringPoint;
    tables.push({
      title: 'Monitoring Details',
      data: [
        { label: 'Instrument Type', value: monitoring.instrumentType },
        { label: 'Installation Date', value: monitoring.date },
        { label: 'Parameters Monitored', value: monitoring.parameters.join(', ') }
      ]
    });
    
    // Add latest readings
    if (monitoring.latestReadings.length > 0) {
      tables.push({
        title: 'Latest Readings',
        data: monitoring.latestReadings.map(reading => ({
          label: reading.parameter,
          value: `${reading.value} ${reading.unit} (${reading.status})`
        }))
      });
    }
  } else if (asset.type === 'infrastructure') {
    const infra = asset as import('../lib/mock-data').Infrastructure;
    tables.push({
      title: 'Infrastructure Details',
      data: [
        { label: 'Type', value: infra.infrastructureType },
        { label: 'Status', value: infra.status }
      ]
    });
    
    // Add specifications
    if (infra.specifications.length > 0) {
      tables.push({
        title: 'Specifications',
        data: infra.specifications.map(spec => ({
          label: spec.key,
          value: spec.value
        }))
      });
    }
  }
  
  return tables;
}

// Helper function to generate mock AI responses
function generateMockResponse(query: string, project: Project, context: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('bearing capacity') || lowerQuery.includes('foundation')) {
    return `Based on the soil investigation data, I can provide bearing capacity analysis:\n\n**Site Conditions:**\n- River Terrace Deposits (dense sandy gravel) from 2.5-8.0m\n- London Clay (very stiff) from 8.0-35.0m\n\n**Preliminary Bearing Capacity:**\nFor a shallow foundation at 3m depth:\n- Ultimate bearing capacity: 850-950 kPa\n- Allowable bearing capacity (FOS=3): 280-320 kPa\n\n**Recommendations:**\n1. Foundation depth: minimum 3.0m below ground level\n2. Foundation type: Pad footings or raft suitable\n3. Settlement analysis required for final design\n4. Consider seasonal water table variations\n\nWould you like me to perform a detailed settlement analysis or check against Eurocode 7 requirements?`;
  }

  if (lowerQuery.includes('groundwater') || lowerQuery.includes('water')) {
    return `**Groundwater Conditions:**\n\nBased on the site investigation:\n- Groundwater encountered at approximately 4-5m below ground level\n- Seasonal variation expected: ±1.0m\n- Perched water table possible in Made Ground layers\n\n**Implications:**\n1. Dewatering may be required for excavations >4m\n2. Waterproofing essential for basement construction\n3. Consider groundwater aggressivity for concrete design (sulfate/chloride testing recommended)\n4. Potential for groundwater rebound in area\n\n**Standards Reference:**\n- BS 8102: Protection of below ground structures against water\n- BRE Special Digest 1: Concrete in aggressive ground`;
  }

  if (lowerQuery.includes('detailed') || lowerQuery.includes('bh-pad')) {
    return `**Detailed Borehole Analysis:**\n\nI've analyzed the selected borehole data:\n\n**Stratigraphy:**\n- Made Ground (0-2.5m): Variable fill, assume zero bearing\n- River Terrace Deposits (2.5-8m): Excellent bearing stratum, φ ≈ 38-40°\n- London Clay (8-35m): Overconsolidated, cu ≈ 100-200 kPa\n\n**Key Parameters:**\n- SPT N-values: 15 (fill), 45 (gravel), 25-30 (clay)\n- Moisture content: Consistent with natural deposits\n- Classification: USCS system applied\n\n**Design Considerations:**\n1. Found below Made Ground (minimum 2.5m depth)\n2. River Terrace Deposits ideal for bearing\n3. London Clay suitable for piles if required\n4. Low to moderate settlement expected\n\nWould you like me to generate a foundation design recommendation?`;
  }

  if (lowerQuery.includes('compliance') || lowerQuery.includes('eurocode')) {
    return `**Eurocode 7 Compliance Check:**\n\n**Applicable Standards:**\n- BS EN 1997-1:2004 (Eurocode 7, Part 1)\n- BS EN 1997-2:2007 (Eurocode 7, Part 2)\n- UK National Annex\n\n**Design Approach:**\nRecommend Design Approach 1 (DA1) for this site:\n- Combination 1: A1 + M1 + R1\n- Combination 2: A2 + M2 + R4\n\n**Geotechnical Categories:**\n- Site complexity: Geotechnical Category 2\n- Ground investigation: Adequate for preliminary design\n- Additional testing recommended for detailed design\n\n**Verification Requirements:**\n✓ Ultimate limit state (bearing, sliding)\n✓ Serviceability limit state (settlement)\n✓ Ground investigation adequate\n⚠ Laboratory testing for shear strength needed\n\n**Next Steps:**\n1. Commission triaxial tests on London Clay\n2. Confirm groundwater chemistry\n3. Specify foundation type for detailed checks`;
  }

  // Default response
  return `I understand you're asking about "${query}".\n\nI have access to the complete site investigation data including:\n- 3 boreholes with detailed soil profiles\n- SPT test results and soil classifications\n- Groundwater information\n- London area geology\n\nI can help you with:\n• Bearing capacity calculations\n• Settlement analysis\n• Foundation design recommendations\n• Compliance checking against Eurocode 7\n• Soil classification and interpretation\n\nCould you please be more specific about what aspect you'd like me to analyze?`;
}
