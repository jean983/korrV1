import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Calendar, User, File, Table, Layers, Activity, Building2 } from 'lucide-react';
import { Asset, BoreholeData, MonitoringPoint, Infrastructure } from '../lib/mock-data';

interface SourcePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  asset?: Asset;
}

export function SourcePreviewDialog({ open, onOpenChange, sourceName, asset }: SourcePreviewDialogProps) {
  // Determine if this is a data source (asset) or document
  const isDataSource = !!asset;
  const isDocument = sourceName.includes('.pdf') || sourceName.includes('.doc') || 
                     sourceName.includes('Report') || sourceName.includes('Eurocode');

  // Get icon based on asset type or document type
  const getIcon = () => {
    if (asset) {
      switch (asset.type) {
        case 'borehole':
          return Layers;
        case 'monitoring':
          return Activity;
        case 'infrastructure':
          return Building2;
        default:
          return Table;
      }
    }
    return isDocument ? File : FileText;
  };

  const Icon = getIcon();

  // Get metadata
  const getMetadata = () => {
    if (asset) {
      return {
        type: asset.type === 'borehole' ? 'Borehole Log' : 
              asset.type === 'monitoring' ? 'Monitoring Data' : 
              'Infrastructure Data',
        date: 'date' in asset ? asset.date : 'N/A',
        author: 'Site Investigation Team'
      };
    }
    
    if (sourceName.includes('Eurocode')) {
      return {
        type: 'Technical Standard',
        date: 'BS EN 1997-1:2004',
        author: 'European Committee for Standardization'
      };
    }
    
    return {
      type: 'Technical Document',
      date: 'Recent',
      author: 'Project Team'
    };
  };

  const metadata = getMetadata();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle>{sourceName}</DialogTitle>
                <DialogDescription className="mt-1">
                  <Badge variant="outline" className="mt-1">{metadata.type}</Badge>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{metadata.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Author</p>
              <p className="text-sm text-muted-foreground">{metadata.author}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Content - scrollable area */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pr-4">
            {isDataSource && asset ? (
              // Render full data tables for assets
              <>
                {asset.type === 'borehole' && <BoreholeFullData data={asset as BoreholeData} />}
                {asset.type === 'monitoring' && <MonitoringFullData data={asset as MonitoringPoint} />}
                {asset.type === 'infrastructure' && <InfrastructureFullData data={asset as Infrastructure} />}
              </>
            ) : isDocument ? (
              // Render document viewer for PDFs/Word docs
              <DocumentViewer sourceName={sourceName} />
            ) : (
              // Fallback for other sources
              <Card className="p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Source Information</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This is a reference source containing geotechnical data and analysis. 
                  Full data access is available through the project management system.
                </p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Component to display full borehole data
function BoreholeFullData({ data }: { data: BoreholeData }) {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Table className="w-4 h-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Borehole ID</p>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Depth</p>
            <p className="font-medium">{data.depth}m</p>
          </div>
          <div>
            <p className="text-muted-foreground">Investigation Date</p>
            <p className="font-medium">{data.date}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{data.location.address}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Coordinates</p>
            <p className="font-medium">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
      </Card>

      {/* Soil Stratigraphy */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Soil Stratigraphy ({data.soilLayers.length} layers)
        </h3>
        <div className="space-y-3">
          {data.soilLayers.map((layer, idx) => (
            <Card key={idx} className="p-3 bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Layer {idx + 1}</p>
                  <p className="text-sm text-muted-foreground">{layer.depth}</p>
                </div>
                <Badge variant="secondary">{layer.classification}</Badge>
              </div>
              <p className="text-sm mb-3">{layer.description}</p>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">SPT N-Value:</span>{' '}
                  <span className="font-medium">{layer.nValue}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Moisture Content:</span>{' '}
                  <span className="font-medium">{layer.moisture}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Component to display full monitoring data
function MonitoringFullData({ data }: { data: MonitoringPoint }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'alert':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Table className="w-4 h-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Monitoring Point</p>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Instrument Type</p>
            <p className="font-medium">{data.instrumentType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Installation Date</p>
            <p className="font-medium">{data.date}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{data.location.address}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Coordinates</p>
            <p className="font-medium">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
      </Card>

      {/* Parameters Monitored */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Parameters Monitored</h3>
        <div className="flex flex-wrap gap-2">
          {data.parameters.map((param, idx) => (
            <Badge key={idx} variant="secondary">{param}</Badge>
          ))}
        </div>
      </Card>

      {/* Latest Readings */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Latest Readings
        </h3>
        <div className="space-y-3">
          {data.latestReadings.map((reading, idx) => (
            <Card key={idx} className="p-3 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{reading.parameter}</p>
                  <p className="text-lg font-semibold mt-1">
                    {reading.value} <span className="text-sm font-normal text-muted-foreground">{reading.unit}</span>
                  </p>
                </div>
                <Badge variant="outline" className={getStatusColor(reading.status)}>
                  {reading.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Component to display full infrastructure data
function InfrastructureFullData({ data }: { data: Infrastructure }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-success/10 text-success border-success/20';
      case 'under-construction':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'planned':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Table className="w-4 h-4" />
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Infrastructure Name</p>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{data.infrastructureType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="outline" className={getStatusColor(data.status)}>
              {data.status.replace('-', ' ')}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{data.location.address}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Coordinates</p>
            <p className="font-medium">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
      </Card>

      {/* Specifications */}
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Specifications
        </h3>
        <div className="space-y-2">
          {data.specifications.map((spec, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">{spec.key}</span>
              <span className="text-sm font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Component to display document viewer (for PDFs, Word docs, etc.)
function DocumentViewer({ sourceName }: { sourceName: string }) {
  return (
    <div className="space-y-4">
      {/* Document viewer placeholder */}
      <Card className="p-8 bg-muted/30 min-h-[400px] flex flex-col items-center justify-center">
        <File className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="font-medium mb-2">{sourceName}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Document preview would appear here
        </p>
        <Badge variant="outline">PDF / Word Viewer</Badge>
      </Card>

      {/* Mock content excerpt */}
      <Card className="p-4 border-l-4 border-l-primary">
        <p className="text-xs text-muted-foreground mb-2">DOCUMENT EXCERPT</p>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Section 4.2: Geotechnical Design Recommendations</p>
          <p className="text-muted-foreground leading-relaxed">
            "The bearing capacity calculations are based on comprehensive site investigation data 
            including SPT results, laboratory testing, and field observations. The recommended design 
            values incorporate appropriate safety factors in accordance with Eurocode 7."
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            "Foundation design should consider the variable soil conditions encountered across the site. 
            Shallow foundations are suitable for areas with competent bearing strata within 2-3m depth, 
            while piled foundations are recommended where soft clays extend beyond 5m depth."
          </p>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground italic">
        💡 In a production environment, this would display an embedded PDF viewer or document preview
      </p>
    </div>
  );
}
