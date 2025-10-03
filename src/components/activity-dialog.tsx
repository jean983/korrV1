import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  ClipboardList,
  Users,
  MapPin,
  Sparkles,
  CheckSquare,
  Repeat
} from 'lucide-react';
import { 
  Activity, 
  mockProjects, 
  mockProjectUsers, 
  activityTypes,
  mockPlaybooks,
  Playbook
} from '../lib/mock-data';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateActivity: (activity: Activity) => void;
}

export function ActivityDialog({ open, onOpenChange, onCreateActivity }: ActivityDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [customType, setCustomType] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    
    // Auto-select playbook if available for this type
    if (type !== 'Custom') {
      const playbook = mockPlaybooks.find(p => p.activityType === type);
      setSelectedPlaybook(playbook || null);
    } else {
      setSelectedPlaybook(null);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleCreate = () => {
    if (!name || !selectedProject || !selectedType || selectedUsers.length === 0) {
      return;
    }

    const activityType = selectedType === 'Custom' ? customType : selectedType;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      name,
      description,
      activityType,
      projectId: selectedProject,
      linkedAssets: selectedAssets.length > 0 ? selectedAssets : undefined,
      status: 'planned',
      assignedUsers: selectedUsers,
      createdBy: 'user-001', // Current user
      createdAt: new Date(),
      updatedAt: new Date(),
      checklist: selectedPlaybook 
        ? selectedPlaybook.checklistItems.map((item, index) => ({
            id: `aci-${Date.now()}-${index}`,
            title: item.title,
            description: item.description,
            completed: false,
            order: item.order
          }))
        : [],
      notes: [],
      files: [],
      playbook: selectedPlaybook || undefined,
      aiContext: selectedPlaybook 
        ? `[AI Context Placeholder] ${selectedPlaybook.contextGuidance}` 
        : undefined,
      isRecurring: isRecurring
    };

    onCreateActivity(newActivity);
    
    // Reset form
    setName('');
    setDescription('');
    setSelectedProject('');
    setSelectedType('');
    setCustomType('');
    setSelectedUsers([]);
    setSelectedAssets([]);
    setSelectedPlaybook(null);
    setIsRecurring(false);
  };

  const selectedProjectData = mockProjects.find(p => p.id === selectedProject);
  const isFormValid = name && selectedProject && selectedType && selectedUsers.length > 0 &&
    (selectedType !== 'Custom' || customType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Set up a new activity with automated playbook assistance
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] px-6">
          <div className="space-y-6 pb-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Activity Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Q2 Environmental Audit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the activity objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
            </div>

            <Separator />

            {/* Project Selection */}
            <div>
              <Label htmlFor="project">Project *</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger id="project" className="mt-1.5">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity Type */}
            <div>
              <Label htmlFor="type">Activity Type *</Label>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger id="type" className="mt-1.5">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedType === 'Custom' && (
                <Input
                  placeholder="Enter custom activity type"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="mt-2"
                />
              )}

              {selectedPlaybook && (
                <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-accent mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Playbook: {selectedPlaybook.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedPlaybook.description}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <CheckSquare className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {selectedPlaybook.checklistItems.length} checklist items will be added
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Recurring Activity */}
            <div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="recurring" className="cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Repeat className="w-4 h-4 text-muted-foreground" />
                      <span>Recurring Activity</span>
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    This activity repeats on a regular schedule (e.g., monthly inspections, quarterly audits)
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Team Assignment */}
            <div>
              <Label>Assign Team Members *</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select users who will be responsible for this activity
              </p>
              <div className="space-y-2 border rounded-lg p-3">
                {mockProjectUsers.map(user => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <Label 
                      htmlFor={`user-${user.id}`}
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Asset Linking */}
            {selectedProjectData && selectedProjectData.assets.length > 0 && (
              <>
                <Separator />
                <div>
                  <Label>Link Assets (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Link specific assets for context and reporting
                  </p>
                  <div className="space-y-2 border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                    {selectedProjectData.assets.map(asset => (
                      <div key={asset.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={`asset-${asset.id}`}
                          checked={selectedAssets.includes(asset.id)}
                          onCheckedChange={() => handleAssetToggle(asset.id)}
                        />
                        <Label 
                          htmlFor={`asset-${asset.id}`}
                          className="cursor-pointer flex-1"
                        >
                          <div className="flex items-center justify-between">
                            <span>{asset.name}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {asset.type}
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* AI Context Preview */}
            {selectedPlaybook && (
              <>
                <Separator />
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Assistance Preview</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedPlaybook.contextGuidance}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Note: Automated context extraction and checklist generation will occur when the activity is created.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!isFormValid}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Create Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
