import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  PlayCircle,
  Moon,
  Sun,
  Bell,
  User,
  LogOut,
  Settings,
  ArrowLeft,
  Repeat
} from 'lucide-react';
import { Activity, mockActivities, mockProjects, mockProjectUsers } from '../lib/mock-data';
import { ActivityDialog } from './activity-dialog';
import { NotificationsPopover } from './notifications-popover';
import { useNotifications } from '../lib/notification-context';

interface ActivitiesPageProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNavigateToDashboard?: () => void;
  onViewActivityDetails?: (activity: Activity) => void;
}

export function ActivitiesPage({ onLogout, theme, onThemeChange, onNavigateToDashboard, onViewActivityDetails }: ActivitiesPageProps) {
  const { addNotification } = useNotifications();
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'planned':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-warning/20 text-warning-foreground';
      case 'completed':
        return 'bg-success/20 text-success-foreground';
      case 'cancelled':
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getUserInitials = (userId: string) => {
    const user = mockProjectUsers.find(u => u.id === userId);
    if (!user) return 'U';
    return user.name.split(' ').map(n => n[0]).join('');
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesProject = projectFilter === 'all' || activity.projectId === projectFilter;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const upcomingActivities = filteredActivities.filter(a => a.status === 'planned').length;
  const inProgressActivities = filteredActivities.filter(a => a.status === 'in-progress').length;
  const completedActivities = filteredActivities.filter(a => a.status === 'completed').length;

  const handleCreateActivity = (activity: Activity) => {
    setActivities([activity, ...activities]);
    setIsCreateDialogOpen(false);
    
    // Add notification
    const project = mockProjects.find(p => p.id === activity.projectId);
    addNotification({
      title: 'Activity Created',
      message: `"${activity.name}" has been created${project ? ` for ${project.name}` : ''}`,
      type: 'success',
      action: 'View Activity',
      projectId: activity.projectId
    });
  };

  const handleDeleteActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    setActivities(activities.filter(a => a.id !== activityId));
    
    // Add notification
    if (activity) {
      addNotification({
        title: 'Activity Deleted',
        message: `"${activity.name}" has been deleted`,
        type: 'warning',
        projectId: activity.projectId
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {onNavigateToDashboard && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onNavigateToDashboard}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1>Activity Management</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage site activities across all projects
              </p>
            </div>
          </div>

          {/* User controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            
            <NotificationsPopover />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 border-b bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl mt-1">{upcomingActivities}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl mt-1">{inProgressActivities}</p>
              </div>
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed (Last 30 days)</p>
                <p className="text-2xl mt-1">{completedActivities}</p>
              </div>
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[200px]">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="border rounded-lg bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => {
                    const completedItems = activity.checklist.filter(item => item.completed).length;
                    const totalItems = activity.checklist.length;
                    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                    return (
                      <TableRow 
                        key={activity.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => onViewActivityDetails?.(activity)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {activity.activityType}
                            </Badge>
                            {activity.isRecurring && (
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                <Repeat className="w-3 h-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{getProjectName(activity.projectId)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(activity.status)}>
                            {getStatusIcon(activity.status)}
                            <span className="ml-1 capitalize">{activity.status.replace('-', ' ')}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex -space-x-2">
                            {activity.assignedUsers.slice(0, 3).map((userId) => (
                              <Avatar key={userId} className="w-8 h-8 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {getUserInitials(userId)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {activity.assignedUsers.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                +{activity.assignedUsers.length - 3}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-10">
                              {progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(activity.updatedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onViewActivityDetails?.(activity);
                              }}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                // Edit functionality
                              }}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteActivity(activity.id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredActivities.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No activities found</p>
                  <p className="text-sm">Try adjusting your filters or create a new activity</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Dialogs */}
      <ActivityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateActivity={handleCreateActivity}
      />
    </div>
  );
}
