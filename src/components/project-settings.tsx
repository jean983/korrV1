import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  ArrowLeft,
  Upload,
  File,
  FileText,
  Image,
  Database,
  FileSpreadsheet,
  X,
  UserPlus,
  Trash2,
  Cloud,
  CheckCircle2,
  XCircle,
  Download,
  Calendar,
  User,
  Tag,
  Bell,
  Moon,
  Sun,
  LogOut,
  Map,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Project, ProjectDocument, ProjectUser, DataSource, ShapefileLayer, mockDocuments, mockProjectUsers, mockDataSources, mockShapefileLayers, mockUser } from '../lib/mock-data';
import { toast } from 'sonner@2.0.3';
import { useNotifications } from '../lib/notification-context';
import { NotificationsPopover } from './notifications-popover';

interface ProjectSettingsProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLogout: () => void;
}

export function ProjectSettings({ project, onBack, onUpdateProject, theme, onThemeChange, onLogout }: ProjectSettingsProps) {
  const { addNotification } = useNotifications();
  const [documents, setDocuments] = useState<ProjectDocument[]>(
    mockDocuments.filter(doc => doc.projectId === project.id)
  );
  const [users, setUsers] = useState<ProjectUser[]>(mockProjectUsers);
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [shapefileLayers, setShapefileLayers] = useState<ShapefileLayer[]>(
    mockShapefileLayers.filter(layer => layer.projectId === project.id)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'editor' | 'viewer'>('viewer');
  const [projectStatus, setProjectStatus] = useState(project.status);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shapefileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocuments = files.map((file, index) => {
      const type = getFileType(file.name);
      return {
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        type,
        size: file.size,
        uploadedBy: 'Sarah Johnson', // Current user
        uploadedAt: new Date(),
        projectId: project.id,
        tags: []
      };
    });

    setDocuments([...documents, ...newDocuments]);
  };

  const getFileType = (filename: string): ProjectDocument['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'report';
    if (['dwg', 'dxf', 'dgn'].includes(ext || '')) return 'drawing';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'photo';
    if (['csv', 'xlsx', 'ags'].includes(ext || '')) return 'data';
    if (['txt', 'md', 'spec'].includes(ext || '')) return 'specification';
    return 'other';
  };

  const getFileIcon = (type: ProjectDocument['type']) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'drawing':
        return FileSpreadsheet;
      case 'photo':
        return Image;
      case 'data':
        return Database;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const handleAddUser = () => {
    if (newUserEmail) {
      const newUser: ProjectUser = {
        id: `user-${Date.now()}`,
        name: newUserEmail.split('@')[0],
        email: newUserEmail,
        role: newUserRole,
        addedAt: new Date()
      };
      setUsers([...users, newUser]);
      setNewUserEmail('');
      setNewUserRole('viewer');
    }
  };

  const handleShapefileUpload = (files: FileList) => {
    // In a real app, this would parse the shapefile (requires .shp, .shx, .dbf files)
    // and convert to GeoJSON for rendering
    Array.from(files).forEach(file => {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.shp') || fileName.endsWith('.zip')) {
        // Simulate shapefile processing
        const newLayer: ShapefileLayer = {
          id: `shp-${Date.now()}`,
          name: file.name.replace(/\.(shp|zip)$/i, ''),
          projectId: project.id,
          uploadedBy: mockUser.name,
          uploadedAt: new Date(),
          fileSize: file.size,
          geometryType: 'Polygon', // Would be determined from actual shapefile
          featureCount: 1,
          visible: true,
          opacity: 0.6,
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
          description: '',
          projection: 'EPSG:4326',
          geoJsonData: {
            type: 'FeatureCollection',
            features: []
          }
        };
        setShapefileLayers([...shapefileLayers, newLayer]);
        toast.success(`Shapefile "${newLayer.name}" uploaded successfully`);
      }
    });
  };

  const handleShapefileButtonClick = () => {
    shapefileInputRef.current?.click();
  };

  const handleToggleLayerVisibility = (layerId: string) => {
    setShapefileLayers(shapefileLayers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
    toast.success('Layer visibility updated');
  };

  const handleDeleteLayer = (layerId: string) => {
    setShapefileLayers(shapefileLayers.filter(layer => layer.id !== layerId));
    toast.success('Layer deleted');
  };

  const handleLayerOpacityChange = (layerId: string, opacity: number) => {
    setShapefileLayers(shapefileLayers.map(layer =>
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  const handleLayerColorChange = (layerId: string, color: string) => {
    setShapefileLayers(shapefileLayers.map(layer =>
      layer.id === layerId ? { ...layer, color } : layer
    ));
    toast.success('Layer style updated');
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleUpdateUserRole = (userId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (newStatus: 'Active' | 'Completed' | 'Planned' | 'Archived') => {
    const oldStatus = projectStatus;
    setProjectStatus(newStatus);
    
    // Update the project
    onUpdateProject({ ...project, status: newStatus });
    
    // Show toast
    toast.success(`Project status changed to ${newStatus}`);
    
    // Add notification
    addNotification({
      title: 'Project Status Updated',
      message: `${project.name} status changed from ${oldStatus} to ${newStatus}`,
      type: 'info',
      action: 'View Project',
      projectId: project.id
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div>
                <h1 className="font-medium">{project.name}</h1>
                <p className="text-sm text-muted-foreground">Project Settings</p>
              </div>
              <Badge variant="outline" className={`${
                project.status === 'Active' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : project.status === 'Completed'
                  ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  : project.status === 'Planned'
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                {project.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
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
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  My Projects
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="documents" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList className="bg-transparent">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="geospatial">Geospatial Data</TabsTrigger>
              <TabsTrigger value="data-sources">Integrations</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            {/* Documents Tab */}
            <TabsContent value="documents" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-6xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                    <CardDescription>
                      Upload reports, drawings, photos, and data files for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="mb-2">
                        Drag and drop files here, or{' '}
                        <button
                          className="text-primary hover:underline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, Word, CAD drawings, images, CSV, and more
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Documents ({documents.length})</CardTitle>
                    <CardDescription>
                      All files uploaded to this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No documents uploaded yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          documents.map((doc) => {
                            const Icon = getFileIcon(doc.type);
                            return (
                              <TableRow key={doc.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="truncate max-w-xs">{doc.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{doc.type}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {formatFileSize(doc.size)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    <span>{doc.uploadedBy}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(doc.uploadedAt)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button variant="ghost" size="icon">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Geospatial Data Tab */}
            <TabsContent value="geospatial" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-6xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Shapefiles</CardTitle>
                    <CardDescription>
                      Upload shapefiles to display spatial data on the project map. Accepts .shp files or .zip archives containing all shapefile components (.shp, .shx, .dbf, .prj)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Button onClick={handleShapefileButtonClick}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Shapefile
                        </Button>
                        <input
                          ref={shapefileInputRef}
                          type="file"
                          accept=".shp,.zip"
                          multiple
                          className="hidden"
                          onChange={(e) => e.target.files && handleShapefileUpload(e.target.files)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Supported formats: .shp, .zip (containing shapefile components)
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Map className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm text-muted-foreground">
                            <p className="mb-2">Shapefiles will be displayed as layers on the project map. You can toggle visibility, adjust opacity, and customize colors for each layer.</p>
                            <p className="text-xs">Note: For best results, ensure your shapefiles are in WGS84 (EPSG:4326) or include projection files (.prj)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Map Layers ({shapefileLayers.length})</CardTitle>
                    <CardDescription>
                      Manage shapefile layers displayed on the project map
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {shapefileLayers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No shapefile layers uploaded yet</p>
                        <p className="text-sm mt-1">Upload a shapefile to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {shapefileLayers.map((layer) => (
                          <div
                            key={layer.id}
                            className="p-4 border rounded-lg space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div
                                  className="w-8 h-8 rounded border-2 flex-shrink-0"
                                  style={{ backgroundColor: layer.color + '40', borderColor: layer.color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{layer.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {layer.geometryType}
                                    </Badge>
                                  </div>
                                  {layer.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {layer.description}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                    <span>{layer.featureCount} features</span>
                                    <span>•</span>
                                    <span>{formatFileSize(layer.fileSize)}</span>
                                    <span>•</span>
                                    <span>Uploaded by {layer.uploadedBy}</span>
                                    <span>•</span>
                                    <span>{formatDate(layer.uploadedAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleLayerVisibility(layer.id)}
                                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                                >
                                  {layer.visible ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteLayer(layer.id)}
                                  title="Delete layer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs">Layer Color</Label>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="color"
                                    value={layer.color}
                                    onChange={(e) => handleLayerColorChange(layer.id, e.target.value)}
                                    className="h-8 w-16 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={layer.color}
                                    onChange={(e) => handleLayerColorChange(layer.id, e.target.value)}
                                    className="flex-1 h-8 text-xs font-mono"
                                    placeholder="#000000"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs">Opacity: {Math.round(layer.opacity * 100)}%</Label>
                                <Input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={layer.opacity}
                                  onChange={(e) => handleLayerOpacityChange(layer.id, parseFloat(e.target.value))}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            {layer.projection && (
                              <div className="text-xs text-muted-foreground pt-2 border-t">
                                Projection: {layer.projection}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Data Sources Tab */}
            <TabsContent value="data-sources" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-6xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Data Sources</CardTitle>
                    <CardDescription>
                      External APIs and databases linked to this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dataSources.map((source) => (
                      <div
                        key={source.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            source.status === 'connected' ? 'bg-success/10' : 
                            source.status === 'error' ? 'bg-destructive/10' : 
                            'bg-muted'
                          }`}>
                            <Cloud className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-sm text-muted-foreground">{source.type}</p>
                            {source.lastSync && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last synced: {formatDate(source.lastSync)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {source.status === 'connected' ? (
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          ) : source.status === 'error' ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                              <XCircle className="w-3 h-3 mr-1" />
                              Error
                            </Badge>
                          ) : (
                            <Badge variant="outline">Disconnected</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Cloud className="w-4 h-4 mr-2" />
                      Add Data Source
                    </Button>
                  </CardContent>
                </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-6xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Team Member</CardTitle>
                    <CardDescription>
                      Invite users to collaborate on this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="email@example.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddUser}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Team ({users.length})</CardTitle>
                    <CardDescription>
                      Manage access and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Added {formatDate(user.addedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={user.role}
                              onValueChange={(value: any) => handleUpdateUserRole(user.id, value)}
                              disabled={user.role === 'owner'}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                            {user.role !== 'owner' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* General Tab */}
            <TabsContent value="general" className="h-full mt-0">
              <ScrollArea className="h-full">
                <div className="p-6 max-w-6xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                    <CardDescription>
                      Basic details about this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input defaultValue={project.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea defaultValue={project.description} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input defaultValue={project.location} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={projectStatus} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-48 bg-muted/30">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator />
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
                    </Button>
                  </CardContent>
                </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}