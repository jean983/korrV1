import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
  Mic,
  MicOff,
  Upload,
  FileText,
  Trash2,
  Download,
  Sparkles,
  Users,
  MapPin,
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  ArrowLeft,
  Repeat,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Edit2,
  Check,
  X,
  Link2,
  Plus
} from 'lucide-react';
import { 
  Activity, 
  mockProjects, 
  mockProjectUsers,
  ActivityNote,
  ActivityFile,
  mockDocuments,
  ActivityChecklistItem,
  ProjectDocument
} from '../lib/mock-data';
import { FilePreviewDialog } from './file-preview-dialog';
import { LinkDocumentsDialog } from './link-documents-dialog';
import { useNotifications } from '../lib/notification-context';

interface ActivityDetailsPageProps {
  activity: Activity;
  onBack: () => void;
  onUpdateActivity: (activity: Activity) => void;
}

export function ActivityDetailsPage({ 
  activity, 
  onBack,
  onUpdateActivity 
}: ActivityDetailsPageProps) {
  const { addNotification } = useNotifications();
  const [localActivity, setLocalActivity] = useState<Activity>(activity);
  const [newNote, setNewNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [previewFile, setPreviewFile] = useState<ProjectDocument | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [linkingDocItemId, setLinkingDocItemId] = useState<string | null>(null);

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getUserName = (userId: string) => {
    const user = mockProjectUsers.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const getUserInitials = (userId: string) => {
    const user = mockProjectUsers.find(u => u.id === userId);
    if (!user) return 'U';
    return user.name.split(' ').map(n => n[0]).join('');
  };

  const handleChecklistToggle = (itemId: string) => {
    const item = localActivity.checklist.find(i => i.id === itemId);
    const wasCompleted = item?.completed || false;
    
    const updatedChecklist = localActivity.checklist.map(checklistItem => {
      if (checklistItem.id === itemId) {
        return {
          ...checklistItem,
          completed: !checklistItem.completed,
          completedBy: !checklistItem.completed ? 'user-001' : undefined,
          completedAt: !checklistItem.completed ? new Date() : undefined
        };
      }
      return checklistItem;
    });

    const updatedActivity = {
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    };
    
    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Checklist item updated');
    
    // Add notification when item is completed
    if (!wasCompleted && item) {
      addNotification({
        title: 'Checklist Item Completed',
        message: `"${item.title}" has been marked as complete in "${localActivity.name}"`,
        type: 'success',
        action: 'View Activity',
        projectId: localActivity.projectId
      });
    }
  };

  const handleExploreFurther = async (itemId: string) => {
    const item = localActivity.checklist.find(i => i.id === itemId);
    if (!item) return;

    // Toggle expanded state
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
      setExpandedItems(newExpanded);
      return;
    }

    newExpanded.add(itemId);
    setExpandedItems(newExpanded);

    // If AI context already fetched, don't fetch again
    if (item.aiContextFetched) return;

    // Simulate AI context fetching
    setLoadingItems(new Set(loadingItems).add(itemId));

    setTimeout(() => {
      const updatedChecklist = localActivity.checklist.map(checklistItem => {
        if (checklistItem.id === itemId) {
          return {
            ...checklistItem,
            aiContext: generateAIContext(checklistItem),
            aiContextFetched: true
          };
        }
        return checklistItem;
      });

      setLocalActivity({
        ...localActivity,
        checklist: updatedChecklist,
        updatedAt: new Date()
      });

      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 1500);
  };

  const generateAIContext = (item: ActivityChecklistItem): string => {
    // Simulate AI-generated context based on item title
    const contextTemplates = {
      'Review waste management procedures': 'Analysis of current waste management procedures shows compliance with BS 5906:2005. Recent waste transfer notes indicate proper segregation of hazardous materials. Key focus areas: verify temporary storage areas have proper signage, check waste collection frequency matches permit conditions, confirm hazardous waste contractors are licensed.',
      'Check compliance with environmental permits': 'Environmental Permit EP3425/AB expires on March 15, 2025. Current permit conditions require: monthly groundwater monitoring (last completed Sept 28), quarterly noise assessments (due Oct 15), annual contaminated land reports. All conditions currently met. Note: Recent regulatory update (EA Guidance Note 2024-08) may require additional dust suppression measures.',
      'Document findings with photos': 'Photo documentation should follow ISO 19650 standards for digital asset management. Recommended capture: wide-angle site overview, close-up of any issues identified, GPS-tagged images of remediated areas. Previous audits used 12MP minimum resolution. Store in project folder: /Environmental/Audits/Q2-2024/',
      'Review maintenance logs': 'Last maintenance performed 30 days ago by Michael Chen. Historical data shows instrument drift of ±0.02mm over 90-day period, within acceptable tolerance. Recommended: verify last calibration certificate is still valid, check for any firmware updates from manufacturer.',
      'Inspect physical condition of equipment': 'Inclinometer INC-PAD-001 installed February 2024. Expected service life: 5-7 years for this environment. Common failure modes: cable damage from rodent activity, sensor drift from temperature fluctuations, housing corrosion in acidic groundwater. Check manufacturer bulletin INC-2024-03 for recent safety notice.',
      'Calibrate instruments': 'Calibration standard: BS EN ISO/IEC 17025. Last calibration performed 30 days ago, next due in 60 days. Calibration drift trending shows stable performance. Recommended procedure: use manufacturer-supplied calibration tool, record pre/post calibration readings, verify against control standard.',
      'Update maintenance records': 'Maintenance records should be updated in the digital asset management system within 24 hours. Required fields: maintenance type, technician name, findings, actions taken, parts replaced, next maintenance due date. Export summary for monthly reporting to client.'
    };

    return contextTemplates[item.title as keyof typeof contextTemplates] || 
      `Based on historical project data and industry best practices, this task requires attention to relevant standards and past findings. Key documents and previous activity reports have been analyzed to provide specific guidance.`;
  };

  const getLinkedDocuments = (fileIds?: string[]) => {
    if (!fileIds || fileIds.length === 0) return [];
    return mockDocuments.filter(doc => fileIds.includes(doc.id));
  };

  const handleStartEdit = (item: ActivityChecklistItem) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = (itemId: string) => {
    const updatedChecklist = localActivity.checklist.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          title: editTitle,
          description: editDescription || undefined
        };
      }
      return item;
    });

    const updatedActivity = {
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Checklist item saved');
    handleCancelEdit();
  };

  const handleFilePreview = (doc: ProjectDocument) => {
    setPreviewFile(doc);
    setShowFilePreview(true);
  };

  const handleSaveLinkedDocuments = (itemId: string, linkedFileIds: string[]) => {
    const item = localActivity.checklist.find(i => i.id === itemId);
    
    const updatedChecklist = localActivity.checklist.map(checklistItem => {
      if (checklistItem.id === itemId) {
        return {
          ...checklistItem,
          linkedFiles: linkedFileIds
        };
      }
      return checklistItem;
    });

    const updatedActivity = {
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Documents linked successfully');
    
    // Add notification
    if (item) {
      addNotification({
        title: 'Documents Linked',
        message: `${linkedFileIds.length} document(s) linked to "${item.title}"`,
        type: 'info',
        action: 'View Activity',
        projectId: localActivity.projectId
      });
    }
    
    setLinkingDocItemId(null);
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = localActivity.checklist.filter(item => item.id !== itemId);

    const updatedActivity = {
      ...localActivity,
      checklist: updatedChecklist,
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Checklist item deleted');
  };

  const handleAddChecklistItem = () => {
    const newItem: ActivityChecklistItem = {
      id: `aci-${Date.now()}`,
      title: 'New checklist item',
      description: '',
      completed: false,
      order: localActivity.checklist.length + 1,
    };

    const updatedActivity = {
      ...localActivity,
      checklist: [...localActivity.checklist, newItem],
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Checklist item added');

    // Automatically enter edit mode for the new item
    setEditingItemId(newItem.id);
    setEditTitle(newItem.title);
    setEditDescription('');
  };

  const handleStatusChange = (status: Activity['status']) => {
    const oldStatus = localActivity.status;
    const updatedActivity = {
      ...localActivity,
      status,
      updatedAt: new Date()
    };
    
    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Activity status updated');
    
    // Add notification
    const statusLabels: Record<Activity['status'], string> = {
      'planned': 'Planned',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    
    addNotification({
      title: 'Activity Status Changed',
      message: `"${localActivity.name}" status changed from ${statusLabels[oldStatus]} to ${statusLabels[status]}`,
      type: status === 'completed' ? 'success' : 'info',
      action: 'View Activity',
      projectId: localActivity.projectId
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: ActivityNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      type: 'text',
      createdBy: 'user-001',
      createdAt: new Date()
    };

    const updatedActivity = {
      ...localActivity,
      notes: [...localActivity.notes, note],
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Note added');
    setNewNote('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording (in production, use MediaRecorder API)
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }

    // Simulate voice note creation
    const voiceNote: ActivityNote = {
      id: `note-${Date.now()}`,
      content: `Voice note recorded (${recordingTime}s)`,
      type: 'voice',
      createdBy: 'user-001',
      createdAt: new Date(),
      voiceUrl: '#',
      duration: recordingTime
    };

    const updatedActivity = {
      ...localActivity,
      notes: [...localActivity.notes, voiceNote],
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('Voice note saved');
    setRecordingTime(0);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const file: ActivityFile = {
      id: `file-${Date.now()}`,
      name: 'Sample Document.pdf',
      type: 'application/pdf',
      size: 1024000,
      url: '#',
      uploadedBy: 'user-001',
      uploadedAt: new Date()
    };

    const updatedActivity = {
      ...localActivity,
      files: [...localActivity.files, file],
      updatedAt: new Date()
    };

    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
    toast.success('File uploaded successfully');
    
    // Add notification
    addNotification({
      title: 'File Uploaded',
      message: `${file.name} uploaded to "${localActivity.name}"`,
      type: 'success',
      action: 'View Activity',
      projectId: localActivity.projectId
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const completedItems = localActivity.checklist.filter(item => item.completed).length;
  const totalItems = localActivity.checklist.length;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl">{localActivity.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {localActivity.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={localActivity.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Planned
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Activity Metadata */}
          <div className="flex flex-wrap gap-4 mt-4 ml-12">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{getProjectName(localActivity.projectId)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline">{localActivity.activityType}</Badge>
            </div>
            {localActivity.isRecurring && (
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  <Repeat className="w-3 h-3 mr-1" />
                  Recurring
                </Badge>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Created {new Date(localActivity.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {localActivity.assignedUsers.slice(0, 3).map((userId) => (
                  <Avatar key={userId} className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {getUserInitials(userId)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {localActivity.assignedUsers.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{localActivity.assignedUsers.length - 3}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckSquare className="w-4 h-4 text-muted-foreground" />
              <span>{completedItems}/{totalItems} completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Context Banner */}
      {localActivity.aiContext && (
        <div className="mx-6 mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">AI Summary and Key Items</p>
              <p className="text-sm text-muted-foreground mt-1">
                {localActivity.aiContext}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="checklist" className="flex flex-col h-full">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="checklist">
              <CheckSquare className="w-4 h-4 mr-2" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="w-4 h-4 mr-2" />
              Notes ({localActivity.notes.length})
            </TabsTrigger>
            <TabsTrigger value="files">
              <Paperclip className="w-4 h-4 mr-2" />
              Files ({localActivity.files.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="flex-1 overflow-hidden mt-4 mx-6">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4 pb-6">
                {/* Add Checklist Item Button - Top */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddChecklistItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Checklist Item
                </Button>
                
                {localActivity.checklist.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No checklist items for this activity</p>
                  </div>
                ) : (
                  localActivity.checklist.map((item) => {
                    const isExpanded = expandedItems.has(item.id);
                    const isLoading = loadingItems.has(item.id);
                    const linkedDocs = getLinkedDocuments(item.linkedFiles);

                    return (
                      <div 
                        key={item.id} 
                        className={`border rounded-lg ${
                          item.completed ? 'bg-muted/30' : 'bg-card'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id={item.id}
                              checked={item.completed}
                              onCheckedChange={() => handleChecklistToggle(item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              {editingItemId === item.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Checklist item title"
                                  />
                                  <Textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description (optional)"
                                    rows={2}
                                  />
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSaveEdit(item.id)}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Save
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={handleCancelEdit}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Label 
                                    htmlFor={item.id}
                                    className={`cursor-pointer ${
                                      item.completed ? 'line-through text-muted-foreground' : ''
                                    }`}
                                  >
                                    {item.title}
                                  </Label>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.completed && item.completedBy && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Completed by {getUserName(item.completedBy)} on{' '}
                                      {item.completedAt && new Date(item.completedAt).toLocaleDateString()}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            {editingItemId !== item.id && (
                              <div className="flex space-x-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(item)}
                                  title="Edit checklist item"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setLinkingDocItemId(item.id)}
                                  title="Link documents"
                                >
                                  <Link2 className="w-4 h-4" />
                                  {linkedDocs.length > 0 && (
                                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                      {linkedDocs.length}
                                    </Badge>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteChecklistItem(item.id)}
                                  title="Delete checklist item"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleExploreFurther(item.id)}
                                >
                                  <Sparkles className="w-4 h-4" />
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* AI Context Panel */}
                        {isExpanded && (
                          <div className="border-t bg-accent/5">
                            <div className="p-4 space-y-4">
                              {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                                  <span className="text-sm text-muted-foreground">
                                    Analyzing historical data and generating insights...
                                  </span>
                                </div>
                              ) : (
                                <>
                                  {/* AI-Generated Context */}
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Sparkles className="w-4 h-4 text-accent" />
                                      <h4 className="text-sm font-medium">AI-Generated Context</h4>
                                    </div>
                                    <div className="bg-card border border-accent/20 rounded-lg p-3">
                                      <p className="text-sm whitespace-pre-line">
                                        {item.aiContext || 'No context available yet. Click "Explore Further" to generate insights.'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Linked Documents */}
                                  {linkedDocs.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-accent" />
                                        <h4 className="text-sm font-medium">Relevant Documents</h4>
                                      </div>
                                      <div className="space-y-2">
                                        {linkedDocs.map((doc) => (
                                          <div 
                                            key={doc.id}
                                            className="flex items-center justify-between p-2 bg-card border rounded hover:bg-muted/50 transition-colors"
                                          >
                                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                  {doc.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  {(doc.size / 1024 / 1024).toFixed(1)} MB • {doc.type}
                                                </p>
                                              </div>
                                            </div>
                                            <Button 
                                              variant="ghost" 
                                              size="sm"
                                              className="flex-shrink-0"
                                              onClick={() => handleFilePreview(doc)}
                                            >
                                              <ExternalLink className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                {/* Add New Item Button */}
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={handleAddChecklistItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Checklist Item
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="flex-1 overflow-hidden mt-4 mx-6">
            <div className="flex flex-col h-full pb-6">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3 pr-4">
                  {localActivity.notes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(note.createdBy)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{getUserName(note.createdBy)}</span>
                          {note.type === 'voice' && (
                            <Badge variant="outline" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {note.type === 'voice' ? (
                        <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded">
                          <Button size="sm" variant="ghost">
                            <Play className="w-3 h-3" />
                          </Button>
                          <div className="flex-1 h-1 bg-muted rounded-full">
                            <div className="h-1 bg-primary rounded-full w-0" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(note.duration || 0)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      )}
                    </div>
                  ))}
                  
                  {localActivity.notes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No notes yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Add Note Section */}
              <div className="border-t pt-4">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mb-2 min-h-[80px]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {!isRecording ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleStartRecording}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Record Voice Note
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleStopRecording}
                      >
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop ({formatDuration(recordingTime)})
                      </Button>
                    )}
                  </div>
                  <Button 
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="flex-1 overflow-hidden mt-4 mx-6">
            <div className="flex flex-col h-full pb-6">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-2 pr-4">
                  {localActivity.files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • Uploaded by {getUserName(file.uploadedBy)} on{' '}
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {localActivity.files.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Paperclip className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No files attached</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Upload Section */}
              <div className="border-t pt-4">
                <Button onClick={handleFileUpload} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Supported: PDF, Images, Documents (Max 10MB)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* File Preview Dialog */}
      <FilePreviewDialog
        file={previewFile}
        open={showFilePreview}
        onOpenChange={setShowFilePreview}
      />

      {/* Link Documents Dialog */}
      {linkingDocItemId && (
        <LinkDocumentsDialog
          open={!!linkingDocItemId}
          onOpenChange={(open) => !open && setLinkingDocItemId(null)}
          currentLinkedFiles={
            localActivity.checklist.find(item => item.id === linkingDocItemId)?.linkedFiles || []
          }
          onSave={(linkedFileIds) => handleSaveLinkedDocuments(linkingDocItemId, linkedFileIds)}
          projectId={localActivity.projectId}
        />
      )}
    </div>
  );
}
