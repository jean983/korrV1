import React, { useState } from 'react';
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
  Grid3x3
} from 'lucide-react';
import { Asset, Project, mockShapefileLayers, ShapefileLayer } from '../lib/mock-data';
import { LeafletMap, BaseMapLayer } from './leaflet-map';

interface MapExpansionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onAssetSelect: (asset: Asset) => void;
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
  
  const projectShapefiles = mockShapefileLayers.filter(l => l.projectId === project.id);

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onAssetSelect(asset);
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
    if (chatInput.trim()) {
      // Handle sending message
      console.log('Sending message:', chatInput);
      setChatInput('');
    }
  };
  
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
              <ScrollArea className="h-40">
                <div className="space-y-3 pr-3">
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
              </ScrollArea>
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


            {/* Minimal Chat Interface */}
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">Quick Query</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask about visible assets
                </p>
              </div>

              {/* Messages area - minimal */}
              <ScrollArea className="flex-1 p-3">
                {selectedAsset ? (
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-start space-x-2">
                        <Bot className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Selected: <strong>{selectedAsset.name}</strong>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedAsset.type} • {selectedAsset.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="text-sm text-muted-foreground">
                      Select an asset on the map to view details
                    </p>
                  </div>
                )}
              </ScrollArea>

              {/* Input area */}
              <div className="p-3 border-t bg-muted/30">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Ask about this asset..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
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
