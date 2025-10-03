import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Settings2, FileText, MapPin, Database } from 'lucide-react';
import { Asset } from '../lib/mock-data';

interface ContextSettingsProps {
  assets: Asset[];
  selectedAssets: string[];
  onAssetToggle: (assetId: string) => void;
}

export function ContextSettings({ assets, selectedAssets, onAssetToggle }: ContextSettingsProps) {
  const [open, setOpen] = useState(false);

  const boreholes = assets.filter(a => a.type === 'borehole');
  const monitoring = assets.filter(a => a.type === 'monitoring');
  const infrastructure = assets.filter(a => a.type === 'infrastructure');

  const AssetCheckbox = ({ asset }: { asset: Asset }) => {
    const isChecked = selectedAssets.includes(asset.id);
    const icon = asset.type === 'borehole' ? Database : asset.type === 'monitoring' ? MapPin : FileText;
    const Icon = icon;

    return (
      <div className="flex items-start space-x-2 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors">
        <Checkbox
          id={asset.id}
          checked={isChecked}
          onCheckedChange={() => onAssetToggle(asset.id)}
          className="mt-0.5"
        />
        <Label
          htmlFor={asset.id}
          className="flex-1 cursor-pointer text-sm space-y-0.5"
        >
          <div className="flex items-center space-x-1.5">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{asset.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {asset.location.address}
          </p>
        </Label>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Settings2 className="w-3 h-3 mr-1" />
          Context ({selectedAssets.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-medium text-sm">Context Settings</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Select data sources to include in AI analysis
          </p>
        </div>
        
        <ScrollArea className="max-h-[400px]">
          <div className="p-3 space-y-4">
            {/* Boreholes */}
            {boreholes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  Boreholes ({boreholes.length})
                </h5>
                <div className="space-y-1">
                  {boreholes.map(asset => (
                    <AssetCheckbox key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            )}

            {/* Monitoring Points */}
            {monitoring.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Monitoring Points ({monitoring.length})
                </h5>
                <div className="space-y-1">
                  {monitoring.map(asset => (
                    <AssetCheckbox key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            )}

            {/* Infrastructure */}
            {infrastructure.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  Infrastructure ({infrastructure.length})
                </h5>
                <div className="space-y-1">
                  {infrastructure.map(asset => (
                    <AssetCheckbox key={asset.id} asset={asset} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => {
                assets.forEach(asset => {
                  if (!selectedAssets.includes(asset.id)) {
                    onAssetToggle(asset.id);
                  }
                });
              }}
              className="text-primary hover:underline"
            >
              Select All
            </button>
            <button
              onClick={() => {
                selectedAssets.forEach(id => onAssetToggle(id));
              }}
              className="text-primary hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
