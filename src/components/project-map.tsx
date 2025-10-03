import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MapPin, 
  Maximize2,
  Activity,
  Building2,
  Layers
} from 'lucide-react';
import { Asset, Project, mockShapefileLayers } from '../lib/mock-data';
import { AssetDetailsPanel } from './asset-details-panel';
import { MapExpansion } from './map-expansion';
import { LeafletMap } from './leaflet-map';

interface ProjectMapProps {
  project: Project;
  onAssetSelect: (asset: Asset) => void;
  onDigDeeper?: (assetName: string) => void;
}

export function ProjectMap({ project, onAssetSelect, onDigDeeper }: ProjectMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate center point for the map (average of all asset coordinates)
  const centerLat = project.assets.reduce((sum, asset) => sum + asset.location.lat, 0) / project.assets.length;
  const centerLng = project.assets.reduce((sum, asset) => sum + asset.location.lng, 0) / project.assets.length;

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    onAssetSelect(asset);
  };

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Site Map</CardTitle>
              <p className="text-sm text-muted-foreground">
                {project.assets.length} assets on site
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsExpanded(true)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Map Area - Real Leaflet Map */}
      <div className="flex-1 relative bg-muted/30 pr-2">
        <LeafletMap
          assets={project.assets}
          selectedAsset={selectedAsset}
          onAssetClick={handleAssetClick}
          shapefileLayers={mockShapefileLayers.filter(layer => layer.projectId === project.id)}
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Asset Details Panel */}
      <CardContent className="p-0 border-t flex-shrink-0 max-h-80 overflow-hidden">
        <AssetDetailsPanel asset={selectedAsset} onDigDeeper={onDigDeeper} />
      </CardContent>

      {/* Map Expansion Dialog */}
      <MapExpansion 
        open={isExpanded}
        onOpenChange={setIsExpanded}
        project={project}
        onAssetSelect={onAssetSelect}
      />
    </div>
  );
}
