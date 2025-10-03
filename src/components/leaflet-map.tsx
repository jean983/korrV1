import React, { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import {
  MapPin,
  Layers,
  Activity,
  Building2,
  FlaskConical,
  Satellite,
  TrendingUp,
  Grid3x3,
  Ruler,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Asset, ShapefileLayer } from '../lib/mock-data';

// Import Leaflet dynamically to avoid SSR issues
import type * as L from 'leaflet';

export type BaseMapLayer = 'street' | 'satellite' | 'terrain' | 'topo';

export type MeasurementMode = 'distance' | 'area' | null;
export type AnalysisTool = 'measurement' | 'coordinates' | 'crossSection' | 'heatmap' | 'clustering' | 'timeSeries' | null;

interface LeafletMapProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onAssetClick: (asset: Asset) => void;
  overlays?: {
    id: string;
    name: string;
    enabled: boolean;
    color: string;
  }[];
  shapefileLayers?: ShapefileLayer[];
  baseLayer?: BaseMapLayer;
  className?: string;
  enableZoom?: boolean;
  activeTool?: AnalysisTool;
  measurementMode?: MeasurementMode;
  showCoordinates?: boolean;
  showGrid?: boolean;
  heatmapData?: 'settlement' | 'groundwater' | 'strength' | null;
  enableClustering?: boolean;
  timeSeriesEnabled?: boolean;
  timeSeriesDate?: Date;
}

export function LeafletMap({
  assets,
  selectedAsset,
  onAssetClick,
  overlays = [],
  shapefileLayers = [],
  baseLayer = 'street',
  className = '',
  enableZoom = true,
  activeTool = null,
  measurementMode = null,
  showCoordinates = false,
  showGrid = false,
  heatmapData = null,
  enableClustering = false,
  timeSeriesEnabled = false,
  timeSeriesDate = new Date()
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const overlayLayersRef = useRef<L.Layer[]>([]);
  const shapefileLayersRef = useRef<L.GeoJSON[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const measurementLayersRef = useRef<L.Layer[]>([]);
  const gridLayersRef = useRef<L.Layer[]>([]);
  const heatmapLayersRef = useRef<L.Layer[]>([]);
  const crossSectionLayersRef = useRef<L.Layer[]>([]);
  const markerClusterGroupRef = useRef<any>(null);
  const coordinateMarkerRef = useRef<L.Marker | null>(null);
  
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const [measurementResult, setMeasurementResult] = useState<string>('');
  const [clickedCoordinate, setClickedCoordinate] = useState<{ lat: number; lng: number } | null>(null);
  const [crossSectionPoints, setCrossSectionPoints] = useState<[number, number][]>([]);

  // Load Leaflet dynamically
  useEffect(() => {
    import('leaflet').then((L) => {
      setLeaflet(L);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapRef.current || mapInstanceRef.current) return;

    // Calculate center from assets
    const avgLat = assets.reduce((sum, asset) => sum + asset.location.lat, 0) / assets.length;
    const avgLng = assets.reduce((sum, asset) => sum + asset.location.lng, 0) / assets.length;

    // Create map
    const map = leaflet.map(mapRef.current, {
      center: [avgLat, avgLng],
      zoom: 13,
      zoomControl: enableZoom,
      scrollWheelZoom: enableZoom,
      doubleClickZoom: enableZoom,
      dragging: true,
      attributionControl: true
    });

    // Add initial tile layer
    const getTileLayer = (layer: BaseMapLayer) => {
      switch (layer) {
        case 'satellite':
          return leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics',
            maxZoom: 19
          });
        case 'terrain':
          return leaflet.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
          });
        case 'topo':
          return leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
          });
        case 'street':
        default:
          return leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          });
      }
    };

    tileLayerRef.current = getTileLayer(baseLayer).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leaflet, assets, enableZoom]);

  // Create custom marker icon
  const createCustomIcon = (
    type: string,
    isSelected: boolean,
    L: typeof import('leaflet')
  ): L.DivIcon => {
    const getIconHtml = () => {
      const iconMap: Record<string, string> = {
        borehole: 'layers',
        monitoring: 'activity',
        infrastructure: 'building-2'
      };
      
      const colorMap: Record<string, string> = {
        borehole: '#186181',
        monitoring: '#769f86',
        infrastructure: '#1d2759'
      };

      const icon = iconMap[type] || 'map-pin';
      const color = colorMap[type] || '#186181';
      const bgColor = isSelected ? color : '#ffffff';
      const iconColor = isSelected ? '#ffffff' : color;

      return `
        <div style="position: relative; width: 32px; height: 32px;">
          <div style="
            width: 32px;
            height: 32px;
            background-color: ${bgColor};
            border: 3px solid ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ${isSelected ? 'transform: scale(1.2);' : ''}
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getIconSvgPath(icon)}
            </svg>
          </div>
          ${isSelected ? `
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 32px;
              height: 32px;
              background-color: ${color};
              opacity: 0.2;
              border-radius: 50%;
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
        </div>
      `;
    };

    return L.divIcon({
      html: getIconHtml(),
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  const getIconSvgPath = (icon: string): string => {
    const paths: Record<string, string> = {
      'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
      'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
      'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>',
      'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>'
    };
    return paths[icon] || paths['map-pin'];
  };

  // Update markers when assets or selection changes
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Clear marker cluster group if it exists
    if (markerClusterGroupRef.current) {
      mapInstanceRef.current.removeLayer(markerClusterGroupRef.current);
      markerClusterGroupRef.current = null;
    }

    // Filter assets based on overlays
    const visibleAssets = assets.filter(asset => {
      if (overlays.length === 0) return true;
      
      const boreholeOverlay = overlays.find(o => o.id === 'boreholes');
      const monitoringOverlay = overlays.find(o => o.id === 'monitoring');
      
      if (asset.type === 'borehole' && boreholeOverlay && !boreholeOverlay.enabled) return false;
      if (asset.type === 'monitoring' && monitoringOverlay && !monitoringOverlay.enabled) return false;
      
      return true;
    });

    // Filter by time series if enabled
    let filteredAssets = visibleAssets;
    if (timeSeriesEnabled && timeSeriesDate) {
      const targetTime = timeSeriesDate.getTime();
      filteredAssets = visibleAssets.filter(asset => {
        const assetDate = new Date((asset as any).date || '2024-01-01').getTime();
        return assetDate <= targetTime;
      });
    }

    // Use clustering if enabled and we have many assets
    if (enableClustering && filteredAssets.length > 5) {
      // Import marker cluster dynamically
      import('leaflet.markercluster').then(() => {
        if (!mapInstanceRef.current || !leaflet) return;

        const MarkerClusterGroup = (leaflet as any).markerClusterGroup;
        const clusterGroup = MarkerClusterGroup({
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 10) size = 'large';
            else if (count > 5) size = 'medium';

            return leaflet.divIcon({
              html: `<div style="
                width: 40px;
                height: 40px;
                background-color: #186181;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
                border: 3px solid white;
              ">${count}</div>`,
              className: 'marker-cluster',
              iconSize: [40, 40]
            });
          }
        });

        filteredAssets.forEach(asset => {
          const isSelected = selectedAsset?.id === asset.id;
          const marker = leaflet.marker([asset.location.lat, asset.location.lng], {
            icon: createCustomIcon(asset.type, isSelected, leaflet)
          });

          const popupContent = `
            <div style="padding: 8px;">
              <div style="font-weight: 500; margin-bottom: 4px;">${asset.name}</div>
              <div style="font-size: 12px; color: #6b7280;">
                ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
              </div>
              ${asset.type === 'borehole' ? `<div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Depth: ${(asset as any).depth}m</div>` : ''}
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.on('click', () => {
            onAssetClick(asset);
          });

          clusterGroup.addLayer(marker);
        });

        mapInstanceRef.current.addLayer(clusterGroup);
        markerClusterGroupRef.current = clusterGroup;
      }).catch(() => {
        // Fallback to regular markers if clustering fails
        addRegularMarkers(filteredAssets);
      });
    } else {
      addRegularMarkers(filteredAssets);
    }

    function addRegularMarkers(assetsToAdd: Asset[]) {
      if (!leaflet || !mapInstanceRef.current) return;

      assetsToAdd.forEach(asset => {
        const isSelected = selectedAsset?.id === asset.id;
        const marker = leaflet
          .marker([asset.location.lat, asset.location.lng], {
            icon: createCustomIcon(asset.type, isSelected, leaflet)
          })
          .addTo(mapInstanceRef.current!);

        const popupContent = `
          <div style="padding: 8px;">
            <div style="font-weight: 500; margin-bottom: 4px;">${asset.name}</div>
            <div style="font-size: 12px; color: #6b7280;">
              ${asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
            </div>
            ${asset.type === 'borehole' ? `<div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Depth: ${(asset as any).depth}m</div>` : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onAssetClick(asset);
        });

        markersRef.current.push(marker);
      });
    }

    // Center on selected asset
    if (selectedAsset) {
      mapInstanceRef.current.setView(
        [selectedAsset.location.lat, selectedAsset.location.lng],
        Math.max(mapInstanceRef.current.getZoom(), 15),
        { animate: true }
      );
    }
  }, [leaflet, assets, selectedAsset, overlays, onAssetClick, enableClustering, timeSeriesEnabled, timeSeriesDate]);

  // Update overlay layers
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear existing overlay layers
    overlayLayersRef.current.forEach(layer => layer.remove());
    overlayLayersRef.current = [];

    // Add settlement contours if enabled
    const settlementOverlay = overlays.find(o => o.id === 'settlement');
    if (settlementOverlay && settlementOverlay.enabled) {
      const avgLat = assets.reduce((sum, asset) => sum + asset.location.lat, 0) / assets.length;
      const avgLng = assets.reduce((sum, asset) => sum + asset.location.lng, 0) / assets.length;

      const circle1 = leaflet.circle([avgLat, avgLng], {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.05,
        radius: 300,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(mapInstanceRef.current);

      const circle2 = leaflet.circle([avgLat, avgLng], {
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.05,
        radius: 500,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(mapInstanceRef.current);

      overlayLayersRef.current.push(circle1, circle2);
    }

    // Add soil sample markers if enabled
    const soilOverlay = overlays.find(o => o.id === 'soil');
    if (soilOverlay && soilOverlay.enabled && assets.length > 0) {
      const avgLat = assets.reduce((sum, asset) => sum + asset.location.lat, 0) / assets.length;
      const avgLng = assets.reduce((sum, asset) => sum + asset.location.lng, 0) / assets.length;

      const soilPoints = [
        [avgLat + 0.001, avgLng],
        [avgLat - 0.001, avgLng + 0.001],
        [avgLat, avgLng - 0.001]
      ];

      soilPoints.forEach(([lat, lng]) => {
        const soilIcon = leaflet.divIcon({
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: #f97316;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
                <path d="M8.5 2h7"></path>
                <path d="M7 16h10"></path>
              </svg>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = leaflet.marker([lat, lng], { icon: soilIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup('<div style="padding: 4px 8px; font-size: 12px;">Soil Sample</div>');

        overlayLayersRef.current.push(marker);
      });
    }
  }, [leaflet, overlays, assets]);

  // Render shapefile layers
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear existing shapefile layers
    shapefileLayersRef.current.forEach(layer => layer.remove());
    shapefileLayersRef.current = [];

    // Add visible shapefile layers
    shapefileLayers
      .filter(layer => layer.visible && layer.geoJsonData)
      .forEach(layer => {
        try {
          const geoJsonLayer = leaflet.geoJSON(layer.geoJsonData, {
            style: (feature) => {
              return {
                color: layer.color,
                fillColor: layer.color,
                fillOpacity: layer.opacity * 0.5,
                weight: 2,
                opacity: layer.opacity
              };
            },
            pointToLayer: (feature, latlng) => {
              const icon = leaflet.divIcon({
                html: `
                  <div style="
                    width: 12px;
                    height: 12px;
                    background-color: ${layer.color};
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  "></div>
                `,
                className: 'shapefile-point-marker',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              });
              return leaflet.marker(latlng, { icon });
            },
            onEachFeature: (feature, featureLayer) => {
              if (feature.properties) {
                const props = feature.properties;
                const popupContent = `
                  <div style="padding: 8px; min-width: 150px;">
                    <div style="font-weight: 500; margin-bottom: 6px; color: ${layer.color};">
                      ${layer.name}
                    </div>
                    ${Object.entries(props).slice(0, 5).map(([key, value]) => `
                      <div style="font-size: 11px; margin-bottom: 2px;">
                        <span style="color: #6b7280; font-weight: 500;">${key}:</span>
                        <span style="margin-left: 4px;">${value}</span>
                      </div>
                    `).join('')}
                    ${Object.keys(props).length > 5 ? 
                      `<div style="font-size: 10px; color: #9ca3af; margin-top: 4px;">
                        +${Object.keys(props).length - 5} more properties
                      </div>` : ''
                    }
                  </div>
                `;
                featureLayer.bindPopup(popupContent);
              }
            }
          }).addTo(mapInstanceRef.current!);

          shapefileLayersRef.current.push(geoJsonLayer);
        } catch (error) {
          console.error(`Error rendering shapefile layer ${layer.name}:`, error);
        }
      });
  }, [leaflet, shapefileLayers]);

  // Handle base layer changes
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current || !tileLayerRef.current) return;

    const getTileLayer = (layer: BaseMapLayer) => {
      switch (layer) {
        case 'satellite':
          return leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, Maxar, Earthstar Geographics',
            maxZoom: 19
          });
        case 'terrain':
          return leaflet.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap contributors',
            maxZoom: 17
          });
        case 'topo':
          return leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 19
          });
        case 'street':
        default:
          return leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          });
      }
    };

    tileLayerRef.current.remove();
    tileLayerRef.current = getTileLayer(baseLayer).addTo(mapInstanceRef.current);
  }, [leaflet, baseLayer]);

  // Handle measurement tool
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear previous measurement layers
    measurementLayersRef.current.forEach(layer => layer.remove());
    measurementLayersRef.current = [];

    if (measurementMode && activeTool === 'measurement') {
      const map = mapInstanceRef.current;

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        
        setMeasurementPoints(prev => {
          const updated = [...prev, newPoint];
          
          // Draw measurement
          if (updated.length > 1) {
            if (measurementMode === 'distance') {
              // Draw polyline
              const line = leaflet.polyline(updated, {
                color: '#186181',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 5'
              }).addTo(map);
              measurementLayersRef.current.push(line);

              // Calculate distance
              let totalDistance = 0;
              for (let i = 0; i < updated.length - 1; i++) {
                const from = leaflet.latLng(updated[i][0], updated[i][1]);
                const to = leaflet.latLng(updated[i + 1][0], updated[i + 1][1]);
                totalDistance += from.distanceTo(to);
              }
              setMeasurementResult(`Distance: ${(totalDistance / 1000).toFixed(2)} km (${totalDistance.toFixed(0)} m)`);
            } else if (measurementMode === 'area' && updated.length > 2) {
              // Draw polygon
              const polygon = leaflet.polygon(updated, {
                color: '#186181',
                fillColor: '#186181',
                fillOpacity: 0.2,
                weight: 3
              }).addTo(map);
              measurementLayersRef.current.push(polygon);

              // Calculate area using shoelace formula
              let area = 0;
              for (let i = 0; i < updated.length; i++) {
                const j = (i + 1) % updated.length;
                const xi = updated[i][1] * Math.PI / 180;
                const yi = updated[i][0] * Math.PI / 180;
                const xj = updated[j][1] * Math.PI / 180;
                const yj = updated[j][0] * Math.PI / 180;
                area += xi * yj - xj * yi;
              }
              area = Math.abs(area / 2);
              const radius = 6371000; // Earth's radius in meters
              const areaMeters = area * radius * radius;
              
              if (areaMeters > 1000000) {
                setMeasurementResult(`Area: ${(areaMeters / 1000000).toFixed(2)} km²`);
              } else {
                setMeasurementResult(`Area: ${areaMeters.toFixed(0)} m²`);
              }
            }
          }

          // Add markers for points
          updated.forEach((point, index) => {
            const marker = leaflet.circleMarker([point[0], point[1]], {
              color: '#186181',
              fillColor: '#ffffff',
              fillOpacity: 1,
              radius: 6,
              weight: 3
            }).addTo(map);
            
            marker.bindPopup(`Point ${index + 1}`);
            measurementLayersRef.current.push(marker);
          });

          return updated;
        });
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    } else {
      setMeasurementPoints([]);
      setMeasurementResult('');
    }
  }, [leaflet, measurementMode, activeTool]);

  // Handle coordinate display
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    if (showCoordinates && activeTool === 'coordinates') {
      const map = mapInstanceRef.current;

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        setClickedCoordinate({ lat: e.latlng.lat, lng: e.latlng.lng });
        
        // Remove previous coordinate marker
        if (coordinateMarkerRef.current) {
          coordinateMarkerRef.current.remove();
        }

        // Add new coordinate marker
        const marker = leaflet.marker([e.latlng.lat, e.latlng.lng], {
          icon: leaflet.divIcon({
            html: `
              <div style="
                width: 12px;
                height: 12px;
                background-color: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            className: 'coordinate-marker',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(map);

        coordinateMarkerRef.current = marker;
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
        if (coordinateMarkerRef.current) {
          coordinateMarkerRef.current.remove();
          coordinateMarkerRef.current = null;
        }
      };
    } else {
      setClickedCoordinate(null);
      if (coordinateMarkerRef.current) {
        coordinateMarkerRef.current.remove();
        coordinateMarkerRef.current = null;
      }
    }
  }, [leaflet, showCoordinates, activeTool]);

  // Handle grid overlay
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear previous grid
    gridLayersRef.current.forEach(layer => layer.remove());
    gridLayersRef.current = [];

    if (showGrid) {
      const map = mapInstanceRef.current;
      const bounds = map.getBounds();
      const gridSpacing = 0.005; // ~500m at equator

      // Draw vertical lines
      for (let lng = Math.floor(bounds.getWest() / gridSpacing) * gridSpacing; 
           lng <= bounds.getEast(); 
           lng += gridSpacing) {
        const line = leaflet.polyline(
          [[bounds.getSouth(), lng], [bounds.getNorth(), lng]],
          {
            color: '#9ca3af',
            weight: 1,
            opacity: 0.3,
            dashArray: '2, 4'
          }
        ).addTo(map);
        gridLayersRef.current.push(line);
      }

      // Draw horizontal lines
      for (let lat = Math.floor(bounds.getSouth() / gridSpacing) * gridSpacing; 
           lat <= bounds.getNorth(); 
           lat += gridSpacing) {
        const line = leaflet.polyline(
          [[lat, bounds.getWest()], [lat, bounds.getEast()]],
          {
            color: '#9ca3af',
            weight: 1,
            opacity: 0.3,
            dashArray: '2, 4'
          }
        ).addTo(map);
        gridLayersRef.current.push(line);
      }
    }
  }, [leaflet, showGrid]);

  // Handle heatmap
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear previous heatmap
    heatmapLayersRef.current.forEach(layer => layer.remove());
    heatmapLayersRef.current = [];

    if (heatmapData && activeTool === 'heatmap') {
      const map = mapInstanceRef.current;
      const avgLat = assets.reduce((sum, asset) => sum + asset.location.lat, 0) / assets.length;
      const avgLng = assets.reduce((sum, asset) => sum + asset.location.lng, 0) / assets.length;

      // Create gradient circles to simulate heatmap
      const heatmapColors: Record<string, string[]> = {
        settlement: ['#ef4444', '#f59e0b', '#fbbf24'],
        groundwater: ['#3b82f6', '#60a5fa', '#93c5fd'],
        strength: ['#22c55e', '#84cc16', '#facc15']
      };

      const colors = heatmapColors[heatmapData] || heatmapColors.settlement;

      colors.forEach((color, index) => {
        const radius = 800 - index * 250;
        const circle = leaflet.circle([avgLat, avgLng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.15 - index * 0.03,
          radius: radius,
          weight: 1,
          opacity: 0.4
        }).addTo(map);
        heatmapLayersRef.current.push(circle);
      });

      // Add data points
      assets.slice(0, 5).forEach((asset, index) => {
        const offset = 0.002;
        const lat = asset.location.lat + (Math.random() - 0.5) * offset;
        const lng = asset.location.lng + (Math.random() - 0.5) * offset;
        
        const value = Math.random() * 100;
        const intensity = Math.floor(value / 33);
        
        const marker = leaflet.circleMarker([lat, lng], {
          color: colors[intensity],
          fillColor: colors[intensity],
          fillOpacity: 0.6,
          radius: 5,
          weight: 2
        }).addTo(map);
        
        marker.bindPopup(`
          <div style="padding: 6px;">
            <div style="font-weight: 500; margin-bottom: 2px;">${heatmapData.charAt(0).toUpperCase() + heatmapData.slice(1)}</div>
            <div style="font-size: 12px;">Value: ${value.toFixed(1)}${heatmapData === 'settlement' ? 'mm' : heatmapData === 'groundwater' ? 'm' : 'kPa'}</div>
          </div>
        `);
        
        heatmapLayersRef.current.push(marker);
      });
    }
  }, [leaflet, heatmapData, activeTool, assets]);

  // Handle cross-section tool
  useEffect(() => {
    if (!leaflet || !mapInstanceRef.current) return;

    // Clear previous cross-section
    crossSectionLayersRef.current.forEach(layer => layer.remove());
    crossSectionLayersRef.current = [];

    if (activeTool === 'crossSection') {
      const map = mapInstanceRef.current;

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        
        setCrossSectionPoints(prev => {
          const updated = prev.length < 2 ? [...prev, newPoint] : [newPoint];
          
          if (updated.length === 2) {
            // Draw line
            const line = leaflet.polyline(updated, {
              color: '#ef4444',
              weight: 4,
              opacity: 0.8
            }).addTo(map);
            crossSectionLayersRef.current.push(line);

            // Add markers at endpoints
            updated.forEach((point, index) => {
              const marker = leaflet.circleMarker([point[0], point[1]], {
                color: '#ef4444',
                fillColor: '#ffffff',
                fillOpacity: 1,
                radius: 8,
                weight: 3
              }).addTo(map);
              
              marker.bindPopup(`Cross-section ${index === 0 ? 'Start' : 'End'}`);
              crossSectionLayersRef.current.push(marker);
            });

            // Add midpoint label
            const midLat = (updated[0][0] + updated[1][0]) / 2;
            const midLng = (updated[0][1] + updated[1][1]) / 2;
            const distance = leaflet.latLng(updated[0]).distanceTo(leaflet.latLng(updated[1]));
            
            const label = leaflet.marker([midLat, midLng], {
              icon: leaflet.divIcon({
                html: `
                  <div style="
                    background-color: #ef4444;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  ">
                    ${(distance / 1000).toFixed(2)} km
                  </div>
                `,
                className: 'cross-section-label',
                iconSize: [60, 24],
                iconAnchor: [30, 12]
              })
            }).addTo(map);
            
            crossSectionLayersRef.current.push(label);
          } else {
            // Just add a marker for the first point
            const marker = leaflet.circleMarker([newPoint[0], newPoint[1]], {
              color: '#ef4444',
              fillColor: '#ffffff',
              fillOpacity: 1,
              radius: 8,
              weight: 3
            }).addTo(map);
            marker.bindPopup('Cross-section Start - Click another point');
            crossSectionLayersRef.current.push(marker);
          }

          return updated;
        });
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    } else {
      setCrossSectionPoints([]);
    }
  }, [leaflet, activeTool]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className={`w-full h-full ${className}`} />
      
      {/* Measurement result display */}
      {measurementResult && activeTool === 'measurement' && (
        <Card className="absolute top-4 right-4 z-[1000] shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center justify-between space-x-3">
              <div>
                <div className="flex items-center space-x-2 text-sm">
                  <Ruler className="w-4 h-4 text-primary" />
                  <span className="font-medium">{measurementResult}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to add points
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setMeasurementPoints([]);
                  setMeasurementResult('');
                  measurementLayersRef.current.forEach(layer => layer.remove());
                  measurementLayersRef.current = [];
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coordinate display */}
      {clickedCoordinate && showCoordinates && activeTool === 'coordinates' && (
        <Card className="absolute top-4 right-4 z-[1000] shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Coordinates</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">Lat:</span>
                  <span className="font-mono">{clickedCoordinate.lat.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between space-x-4">
                  <span className="text-muted-foreground">Lng:</span>
                  <span className="font-mono">{clickedCoordinate.lng.toFixed(6)}°</span>
                </div>
                <div className="pt-1 border-t">
                  <span className="text-muted-foreground">UTM: </span>
                  <span className="font-mono text-xs">
                    Zone {Math.floor((clickedCoordinate.lng + 180) / 6) + 1}N
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-section info */}
      {crossSectionPoints.length > 0 && activeTool === 'crossSection' && (
        <Card className="absolute top-4 right-4 z-[1000] shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-destructive" />
                <span className="font-medium text-sm">Cross-Section Tool</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {crossSectionPoints.length === 1 
                  ? 'Click end point on map' 
                  : 'Section profile ready. Click new point to restart.'}
              </p>
              {crossSectionPoints.length === 2 && (
                <div className="pt-2 border-t text-xs">
                  <p className="text-muted-foreground mb-1">Intersecting boreholes:</p>
                  <div className="space-y-1">
                    {assets.slice(0, 2).map(asset => (
                      <div key={asset.id} className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{asset.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}