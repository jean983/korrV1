import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  MapPin,
  Layers,
  Activity,
  Building2,
  Send,
  Bot,
  Settings2,
  Satellite,
  FlaskConical,
  TrendingUp,
  MapPinned,
  Grid3x3,
  ChevronUp,
  ChevronDown,
  Ruler,
  Crosshair,
  TrendingDown,
  Flame,
  GitMerge,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Asset, Project, mockShapefileLayers, ShapefileLayer } from '../lib/mock-data';
import { LeafletMap, BaseMapLayer, AnalysisTool, MeasurementMode } from './leaflet-map';

interface MapExpansionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onAssetSelect: (asset: Asset) => void;
}

interface MapChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MapOverlay {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  color: string;
}

export function MapExpansion({ open, onOpenChange, project, onAssetSelect }: MapExpansionProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<MapChatMessage[]>([]);
  const [baseLayer, setBaseLayer] = useState<BaseMapLayer>('street');
  const [shapefilesEnabled, setShapefilesEnabled] = useState(true);
  const [enabledShapefiles, setEnabledShapefiles] = useState<string[]>(
    mockShapefileLayers.filter(l => l.projectId === project.id && l.visible).map(l => l.id)
  );
  const [overlays, setOverlays] = useState<MapOverlay[]>([
    { id: 'insar', name: 'InSAR Data', icon: Satellite, enabled: false, color: 'text-purple-500' },
    { id: 'soil', name: 'Soil Sample Results', icon: FlaskConical, enabled: false, color: 'text-orange-500' },
    { id: 'monitoring', name: 'Monitoring Points', icon: Activity, enabled: true, color: 'text-accent' },
    { id: 'settlement', name: 'Settlement Contours', icon: TrendingUp, enabled: false, color: 'text-red-500' },
    { id: 'boreholes', name: 'Borehole Locations', icon: Layers, enabled: true, color: 'text-primary' },
    { id: 'grid', name: 'Survey Grid', icon: Grid3x3, enabled: false, color: 'text-gray-500' },
  ]);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  
  // Analysis tools state
  const [activeTool, setActiveTool] = useState<AnalysisTool>(null);
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [heatmapData, setHeatmapData] = useState<'settlement' | 'groundwater' | 'strength' | null>(null);
  const [enableClustering, setEnableClustering] = useState(false);
  const [timeSeriesEnabled, setTimeSeriesEnabled] = useState(false);
  const [timeSeriesDate, setTimeSeriesDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  
  const projectShapefiles = mockShapefileLayers.filter(l => l.projectId === project.id);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewportRef.current) {
      const viewport = scrollViewportRef.current;
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [chatMessages]);

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onAssetSelect(asset);
    
    // Add a context message when asset is selected
    if (chatMessages.length === 0) {
      setChatMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: `I can help you analyze ${asset.name}. This ${asset.type} is currently ${asset.status}. What would you like to know?`,
        timestamp: new Date()
      }]);
    }
  };

  const handleOverlayToggle = (overlayId: string) => {
    setOverlays(overlays.map(overlay => 
      overlay.id === overlayId 
        ? { ...overlay, enabled: !overlay.enabled }
        : overlay
    ));
  };

  const handleToggleShapefile = (shapefileId: string) => {
    setEnabledShapefiles(prev => 
      prev.includes(shapefileId)
        ? prev.filter(id => id !== shapefileId)
        : [...prev, shapefileId]
    );
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && selectedAsset) {
      // Add user message
      const userMessage: MapChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: chatInput,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response based on selected asset
      setTimeout(() => {
        const assistantMessage: MapChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Based on ${selectedAsset.name}, I found the following information: This ${selectedAsset.type} is located at ${selectedAsset.coordinates.lat.toFixed(4)}, ${selectedAsset.coordinates.lng.toFixed(4)}. Current status: ${selectedAsset.status}. I can provide more detailed analysis if needed.`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      }, 500);
      
      setChatInput('');
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setChatInput(value);
    
    // Auto-collapse filters when user starts typing
    if (value.length > 0 && !filtersCollapsed) {
      setFiltersCollapsed(true);
    }
  };

  // Handle tool activation
  const handleToolToggle = (tool: AnalysisTool) => {
    if (activeTool === tool) {
      setActiveTool(null);
      setMeasurementMode(null);
      setShowCoordinates(false);
      setHeatmapData(null);
    } else {
      setActiveTool(tool);
      // Set default states for each tool
      if (tool === 'measurement') {
        setMeasurementMode('distance');
      } else if (tool === 'coordinates') {
        setShowCoordinates(true);
      } else if (tool === 'heatmap') {
        setHeatmapData('settlement');
      }
    }
  };

  // Time series playback
  useEffect(() => {
    if (!isPlaying || !timeSeriesEnabled) return;

    const interval = setInterval(() => {
      setTimeSeriesDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + 1);
        
        // Loop back to start if we reach current date
        if (newDate > new Date()) {
          return new Date('2024-01-01');
        }
        return newDate;
      });
    }, 1000); // Advance 1 month per second

    return () => clearInterval(interval);
  }, [isPlaying, timeSeriesEnabled]);
  
  // Filter shapefiles based on enabled state
  const visibleShapefiles = shapefilesEnabled 
    ? projectShapefiles.filter(sf => enabledShapefiles.includes(sf.id))
    : [];

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'borehole':
        return Layers;
      case 'monitoring':
        return Activity;
      case 'infrastructure':
        return Building2;
      default:
        return MapPin;
    }
  };

  const getAssetColor = (type: string) => {
    switch (type) {
      case 'borehole':
        return 'bg-primary border-primary';
      case 'monitoring':
        return 'bg-accent border-accent';
      case 'infrastructure':
        return 'bg-secondary border-primary';
      default:
        return 'bg-primary border-primary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[1400px] !h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Accessibility - Hidden but present for screen readers */}
        <DialogTitle className="sr-only">{project.name} - Site Map</DialogTitle>
        <DialogDescription className="sr-only">
          Interactive site map showing {project.assets.length} assets at {project.location}. Use the overlay settings to toggle different data layers.
        </DialogDescription>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Map Area */}
          <div className="flex-1 relative bg-muted/30">
            <LeafletMap
              assets={project.assets}
              selectedAsset={selectedAsset}
              onAssetClick={handleAssetClick}
              overlays={overlays}
              shapefileLayers={visibleShapefiles}
              baseLayer={baseLayer}
              className="w-full h-full"
              activeTool={activeTool}
              measurementMode={measurementMode}
              showCoordinates={showCoordinates}
              showGrid={showGrid}
              heatmapData={heatmapData}
              enableClustering={enableClustering}
              timeSeriesEnabled={timeSeriesEnabled}
              timeSeriesDate={timeSeriesDate}
            />
            
            {/* Location and overlay badges */}
            <div className="absolute top-4 left-4 space-y-2 z-[1000] pointer-events-none">
              <Badge variant="secondary" className="shadow-sm pointer-events-auto">
                <MapPin className="w-3 h-3 mr-1" />
                {project.location}
              </Badge>
              {overlays.some(o => o.enabled) && (
                <div className="flex flex-wrap gap-1">
                  {overlays.filter(o => o.enabled).map(overlay => {
                    const Icon = overlay.icon;
                    return (
                      <Badge 
                        key={overlay.id} 
                        variant="outline" 
                        className="bg-background/80 backdrop-blur-sm text-xs pointer-events-auto"
                      >
                        <Icon className={`w-3 h-3 mr-1 ${overlay.color}`} />
                        {overlay.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Overlay Settings + Minimal Chat */}
          <div className="w-80 border-l bg-card flex flex-col">
            {/* Filters Header with Collapse Toggle */}
            <div className="p-3 border-b bg-muted/30">
              <button
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                className="w-full flex items-center justify-between hover:bg-muted/50 rounded-md px-2 py-1.5 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Map Settings</span>
                  {filtersCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-primary group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </div>
              </button>
              {filtersCollapsed && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {baseLayer}
                  </Badge>
                  {overlays.filter(o => o.enabled).map(overlay => (
                    <Badge key={overlay.id} variant="outline" className="text-xs">
                      {overlay.name.split(' ')[0]}
                    </Badge>
                  ))}
                  {shapefilesEnabled && enabledShapefiles.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {enabledShapefiles.length} Shapefile{enabledShapefiles.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Collapsible Filters Content */}
            {!filtersCollapsed && (
              <ScrollArea className="flex-shrink-0" style={{ maxHeight: '60vh' }}>
                {/* Base Map Layer Selection */}
                <div className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-3">
                <MapPinned className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Base Map</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={baseLayer === 'street' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBaseLayer('street')}
                  className="h-8 text-xs"
                >
                  Street
                </Button>
                <Button
                  variant={baseLayer === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBaseLayer('satellite')}
                  className="h-8 text-xs"
                >
                  <Satellite className="w-3 h-3 mr-1" />
                  Satellite
                </Button>
                <Button
                  variant={baseLayer === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBaseLayer('terrain')}
                  className="h-8 text-xs"
                >
                  Terrain
                </Button>
                <Button
                  variant={baseLayer === 'topo' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBaseLayer('topo')}
                  className="h-8 text-xs"
                >
                  Topo
                </Button>
              </div>
            </div>

            <Separator />

            {/* Overlay Settings */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-3">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Data Overlays</h3>
              </div>
              <div className="space-y-3">
                {overlays.map((overlay) => {
                  const Icon = overlay.icon;
                  return (
                    <div key={overlay.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={overlay.id}
                        checked={overlay.enabled}
                        onCheckedChange={() => handleOverlayToggle(overlay.id)}
                      />
                      <Label 
                        htmlFor={overlay.id}
                        className="flex items-center space-x-2 cursor-pointer flex-1"
                      >
                        <Icon className={`w-4 h-4 ${overlay.color}`} />
                        <span className="text-sm">{overlay.name}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Analysis Tools */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-3">
                <Ruler className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Analysis Tools</h3>
              </div>
              <div className="space-y-2">
                {/* Measurement Tool */}
                <div className="space-y-2">
                  <Button
                    variant={activeTool === 'measurement' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToolToggle('measurement')}
                    className="w-full justify-start h-8 text-xs"
                  >
                    <Ruler className="w-3.5 h-3.5 mr-2" />
                    Measurement Tool
                  </Button>
                  {activeTool === 'measurement' && (
                    <div className="ml-4 flex gap-2">
                      <Button
                        variant={measurementMode === 'distance' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMeasurementMode('distance')}
                        className="flex-1 h-7 text-xs"
                      >
                        Distance
                      </Button>
                      <Button
                        variant={measurementMode === 'area' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMeasurementMode('area')}
                        className="flex-1 h-7 text-xs"
                      >
                        Area
                      </Button>
                    </div>
                  )}
                </div>

                {/* Coordinate Display */}
                <div className="space-y-2">
                  <Button
                    variant={activeTool === 'coordinates' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToolToggle('coordinates')}
                    className="w-full justify-start h-8 text-xs"
                  >
                    <Crosshair className="w-3.5 h-3.5 mr-2" />
                    Coordinate Display
                  </Button>
                  {activeTool === 'coordinates' && (
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-grid"
                          checked={showGrid}
                          onCheckedChange={(checked) => setShowGrid(!!checked)}
                        />
                        <Label htmlFor="show-grid" className="text-xs cursor-pointer">
                          Show Grid Overlay
                        </Label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cross-Section Tool */}
                <Button
                  variant={activeTool === 'crossSection' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleToolToggle('crossSection')}
                  className="w-full justify-start h-8 text-xs"
                >
                  <TrendingDown className="w-3.5 h-3.5 mr-2" />
                  Cross-Section
                </Button>

                {/* Heatmap Tool */}
                <div className="space-y-2">
                  <Button
                    variant={activeTool === 'heatmap' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToolToggle('heatmap')}
                    className="w-full justify-start h-8 text-xs"
                  >
                    <Flame className="w-3.5 h-3.5 mr-2" />
                    Heatmap Visualization
                  </Button>
                  {activeTool === 'heatmap' && (
                    <div className="ml-4 space-y-1">
                      <Button
                        variant={heatmapData === 'settlement' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setHeatmapData('settlement')}
                        className="w-full justify-start h-7 text-xs"
                      >
                        Settlement
                      </Button>
                      <Button
                        variant={heatmapData === 'groundwater' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setHeatmapData('groundwater')}
                        className="w-full justify-start h-7 text-xs"
                      >
                        Groundwater
                      </Button>
                      <Button
                        variant={heatmapData === 'strength' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setHeatmapData('strength')}
                        className="w-full justify-start h-7 text-xs"
                      >
                        Soil Strength
                      </Button>
                    </div>
                  )}
                </div>

                {/* Marker Clustering */}
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id="enable-clustering"
                    checked={enableClustering}
                    onCheckedChange={(checked) => setEnableClustering(!!checked)}
                  />
                  <Label htmlFor="enable-clustering" className="flex items-center space-x-2 cursor-pointer flex-1">
                    <GitMerge className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs">Marker Clustering</span>
                  </Label>
                </div>

                {/* Time Series */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="time-series"
                      checked={timeSeriesEnabled}
                      onCheckedChange={(checked) => {
                        setTimeSeriesEnabled(!!checked);
                        if (!checked) setIsPlaying(false);
                      }}
                    />
                    <Label htmlFor="time-series" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs">Time Series Animation</span>
                    </Label>
                  </div>
                  {timeSeriesEnabled && (
                    <div className="ml-4 space-y-2">
                      <div className="text-xs text-center font-medium">
                        {timeSeriesDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTimeSeriesDate(new Date('2024-01-01'));
                            setIsPlaying(false);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <SkipBack className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="h-7 w-7 p-0"
                        >
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTimeSeriesDate(new Date());
                            setIsPlaying(false);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <SkipForward className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Shapefile Layers */}
            {projectShapefiles.length > 0 && (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2 mb-3">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium">Shapefile Layers</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="shapefiles-enabled"
                        checked={shapefilesEnabled}
                        onCheckedChange={(checked) => setShapefilesEnabled(!!checked)}
                      />
                      <Label 
                        htmlFor="shapefiles-enabled"
                        className="cursor-pointer flex-1 font-medium text-sm"
                      >
                        Show Shapefiles
                      </Label>
                    </div>
                    
                    {shapefilesEnabled && (
                      <div className="ml-6 space-y-2 border-l-2 border-border pl-3">
                        <ScrollArea className="max-h-32">
                          {projectShapefiles.map((shapefile) => (
                            <div key={shapefile.id} className="flex items-center space-x-2 mb-2">
                              <Checkbox 
                                id={`shapefile-${shapefile.id}`}
                                checked={enabledShapefiles.includes(shapefile.id)}
                                onCheckedChange={() => handleToggleShapefile(shapefile.id)}
                              />
                              <Label 
                                htmlFor={`shapefile-${shapefile.id}`}
                                className="cursor-pointer flex-1 flex items-center space-x-2"
                              >
                                <div
                                  className="w-3 h-3 rounded-sm border flex-shrink-0"
                                  style={{ backgroundColor: shapefile.color + '80', borderColor: shapefile.color }}
                                />
                                <span className="text-xs truncate">{shapefile.name}</span>
                              </Label>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}
              </ScrollArea>
            )}

            {/* Minimal Chat Interface */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-3 border-b flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Quick Query</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask about {selectedAsset ? selectedAsset.name : 'visible assets'}
                </p>
              </div>

              {/* Messages area - scrollable */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div ref={scrollViewportRef} className="p-3 space-y-3">
                    {chatMessages.length === 0 && !selectedAsset && (
                      <div className="flex items-center justify-center h-full text-center py-8">
                        <p className="text-sm text-muted-foreground">
                          Select an asset on the map to start chatting
                        </p>
                      </div>
                    )}
                    
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          <Avatar className="w-7 h-7 flex-shrink-0">
                            {message.role === 'assistant' ? (
                              <div className="w-full h-full bg-primary flex items-center justify-center">
                                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                              </div>
                            ) : (
                              <AvatarFallback className="text-xs">U</AvatarFallback>
                            )}
                          </Avatar>

                          {/* Message Content */}
                          <div className="flex flex-col space-y-1">
                            <div
                              className={`rounded-lg p-2.5 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground px-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Input area */}
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Ask about this asset..."
                      value={chatInput}
                      onChange={handleChatInputChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] max-h-[120px] resize-none"
                    />
                  </div>
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
