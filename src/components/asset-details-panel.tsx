import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Gauge,
  Building2,
  Activity,
  Calendar,
  Layers,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Pickaxe
} from 'lucide-react';
import { Asset, BoreholeData, MonitoringPoint, Infrastructure } from '../lib/mock-data';

interface AssetDetailsPanelProps {
  asset: Asset | null;
  onDigDeeper?: (assetName: string) => void;
}

export function AssetDetailsPanel({ asset, onDigDeeper }: AssetDetailsPanelProps) {
  if (!asset) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div className="space-y-2">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Select an asset on the map to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Dig Deeper Button */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{asset.type}</Badge>
          <span className="text-sm text-muted-foreground">{asset.name}</span>
        </div>
        {onDigDeeper && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onDigDeeper(asset.name)}
            className="gap-2"
          >
            <Pickaxe className="w-4 h-4" />
            Dig Deeper
          </Button>
        )}
      </div>

      {asset.type === 'borehole' && <BoreholeDetails data={asset as BoreholeData} />}
      {asset.type === 'monitoring' && <MonitoringDetails data={asset as MonitoringPoint} />}
      {asset.type === 'infrastructure' && <InfrastructureDetails data={asset as Infrastructure} />}
    </div>
  );
}

function BoreholeDetails({ data }: { data: BoreholeData }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{data.name}</h3>
            <Badge variant="outline" className="mt-1">Borehole</Badge>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Location</p>
            <p>{data.location.address}</p>
            <p className="text-xs text-muted-foreground">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Investigation Date</p>
            <p>{data.date}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <Gauge className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Total Depth</p>
            <p>{data.depth}m</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Soil Layers */}
      <div className="space-y-2">
        <h4 className="font-medium flex items-center space-x-2">
          <Layers className="w-4 h-4" />
          <span>Soil Stratigraphy ({data.soilLayers.length} layers)</span>
        </h4>
        <div className="space-y-2">
          {data.soilLayers.map((layer, idx) => (
            <Card key={idx} className="p-3 bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">{layer.depth}</span>
                <Badge variant="secondary" className="text-xs">
                  {layer.classification}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{layer.description}</p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">SPT N:</span>{' '}
                  <span className="font-medium">{layer.nValue}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">MC:</span>{' '}
                  <span className="font-medium">{layer.moisture}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MonitoringDetails({ data }: { data: MonitoringPoint }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold">{data.name}</h3>
            <Badge variant="outline" className="mt-1">Monitoring Point</Badge>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Location</p>
            <p>{data.location.address}</p>
            <p className="text-xs text-muted-foreground">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <Gauge className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Instrument Type</p>
            <p>{data.instrumentType}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Installation Date</p>
            <p>{data.date}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Parameters Monitored */}
      <div className="space-y-2">
        <h4 className="font-medium">Parameters Monitored</h4>
        <div className="flex flex-wrap gap-2">
          {data.parameters.map((param, idx) => (
            <Badge key={idx} variant="secondary">
              {param}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Latest Readings */}
      <div className="space-y-2">
        <h4 className="font-medium flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>Latest Readings</span>
        </h4>
        <div className="space-y-2">
          {data.latestReadings.map((reading, idx) => (
            <Card key={idx} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{reading.parameter}</p>
                  <p className="text-lg font-semibold mt-1">
                    {reading.value} <span className="text-sm font-normal text-muted-foreground">{reading.unit}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(reading.status)}
                  <Badge variant="outline" className={getStatusColor(reading.status)}>
                    {reading.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfrastructureDetails({ data }: { data: Infrastructure }) {
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{data.name}</h3>
            <Badge variant="outline" className="mt-1">Infrastructure</Badge>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-start space-x-2">
          <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Type</p>
            <p>{data.infrastructureType}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <Activity className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant="outline" className={`${getStatusColor(data.status)} mt-1`}>
              {data.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-muted-foreground">Location</p>
            <p>{data.location.address}</p>
            <p className="text-xs text-muted-foreground">
              {data.location.lat.toFixed(4)}°N, {Math.abs(data.location.lng).toFixed(4)}°W
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Specifications */}
      <div className="space-y-2">
        <h4 className="font-medium flex items-center space-x-2">
          <Gauge className="w-4 h-4" />
          <span>Specifications</span>
        </h4>
        <div className="space-y-2">
          {data.specifications.map((spec, idx) => (
            <Card key={idx} className="p-3 bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{spec.key}</span>
                <span className="text-sm font-medium">{spec.value}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}