# KorrAI Map Analysis Tools

## Overview
The KorrAI platform now includes 6 powerful geotechnical analysis tools integrated into the interactive map system. All tools are accessible through the "Analysis Tools" section in the Map Settings panel.

---

## 🎯 Feature 1: Measurement Tool

**Purpose:** Calculate distances and areas directly on the map for excavation planning, site layout, and distance calculations between boreholes.

### How to Use:
1. Click "Measurement Tool" in Analysis Tools section
2. Select either:
   - **Distance Mode**: Click points on map to measure linear distance
   - **Area Mode**: Click 3+ points to measure enclosed area (polygon closes automatically)
3. Result displays in top-right corner showing:
   - Distance: meters and kilometers
   - Area: square meters or square kilometers

### Use Cases:
- Measure distance between boreholes
- Calculate excavation area
- Plan equipment access routes
- Determine perimeter of investigation zones

### Reset:
- Click the X button on the result card to clear measurements
- Click new points to start a new measurement

---

## 🎯 Feature 2: Coordinate Display & Grid System

**Purpose:** Display exact coordinates of any point on the map with multiple coordinate systems, plus optional grid overlay for survey work.

### How to Use:
1. Click "Coordinate Display" in Analysis Tools
2. Click anywhere on the map to see:
   - Latitude (6 decimal precision)
   - Longitude (6 decimal precision)
   - UTM Zone calculation
3. Enable "Show Grid Overlay" checkbox for survey grid lines (~500m spacing)

### Display:
- Red dot marker appears at clicked location
- Coordinate card appears in top-right corner
- Grid lines appear in light gray with dashed pattern

### Use Cases:
- Reference exact coordinates for reports
- Correlate with survey data
- Share locations with field teams
- Cross-reference with GPS readings

---

## 🎯 Feature 3: Cross-Section Tool

**Purpose:** Draw a transect line across the site to identify which boreholes intersect that section, useful for creating geological cross-sections.

### How to Use:
1. Click "Cross-Section" in Analysis Tools
2. Click **Start Point** on map
3. Click **End Point** on map
4. Red line appears showing the transect
5. Info card shows:
   - Distance of section line
   - List of boreholes that intersect the section
   - "Click new point to restart"

### Visual Elements:
- Red line with large circular endpoints
- Distance label at midpoint
- List of intersecting assets in info card

### Use Cases:
- Plan geological cross-sections
- Identify boreholes along a transect
- Visualize subsurface profiles
- Create section drawings for reports

---

## 🎯 Feature 4: Heatmap Visualization

**Purpose:** Display spatial distribution of geotechnical data as gradient heatmaps for settlement, groundwater levels, or soil strength.

### How to Use:
1. Click "Heatmap Visualization" in Analysis Tools
2. Select data type:
   - **Settlement**: Red/orange/yellow gradient (values in mm)
   - **Groundwater**: Blue gradient (values in meters)
   - **Soil Strength**: Green/lime/yellow gradient (values in kPa)
3. Gradient circles appear centered on site with sample data points
4. Click data points to see specific values

### Visual Elements:
- Large gradient circles showing intensity zones
- Small colored markers showing sample locations
- Popup with data values on click

### Use Cases:
- Visualize settlement patterns
- Map groundwater table variations
- Display soil strength distribution
- Identify risk zones at a glance

### Mock Data:
Currently displays example data patterns. In production, connect to actual geotechnical monitoring data.

---

## 🎯 Feature 5: Marker Clustering

**Purpose:** Automatically group nearby markers when zoomed out, improving performance and readability on sites with many assets (100+ boreholes).

### How to Use:
1. Check "Marker Clustering" checkbox in Analysis Tools
2. Map automatically clusters markers when zoomed out
3. Cluster icons show number of grouped markers
4. Click cluster to zoom in and expand (spider effect)
5. Uncheck to return to individual markers

### Visual Elements:
- Circular cluster icons with count numbers
- Primary brand color (#186181)
- Size varies with cluster size:
  - Small: 1-5 markers
  - Medium: 6-10 markers  
  - Large: 11+ markers

### Performance:
- Activates automatically when site has 5+ assets
- Significantly improves map performance with 100+ markers
- Smooth zoom animations

### Use Cases:
- Large sites with many boreholes
- Regional projects with multiple locations
- Dense monitoring networks
- Improved mobile performance

---

## 🎯 Feature 6: Time Series Animation

**Purpose:** Animate map data over time to visualize how site conditions, monitoring points, or construction progress evolved month-by-month.

### How to Use:
1. Check "Time Series Animation" checkbox
2. Use playback controls:
   - **⏮ Skip Back**: Jump to start (Jan 2024)
   - **▶ Play / ⏸ Pause**: Animate month-by-month (1 month/second)
   - **⏭ Skip Forward**: Jump to current date
3. Current date displays above controls
4. Map shows only assets/data from dates ≤ selected date

### Visual Elements:
- Date display showing current month/year
- Playback controls (3 buttons)
- Assets fade in/out based on date
- Animation loops when reaching current date

### Use Cases:
- Visualize site investigation timeline
- Show construction progress over time
- Track monitoring point installation dates
- Create time-lapse videos for presentations
- Compare seasonal variations in data

### Mock Data:
Uses asset dates from mock data. In production, filter real-time data by timestamp.

---

## 💡 Tips & Best Practices

### Performance Optimization:
- Enable clustering on sites with 20+ assets
- Collapse filters when typing in chat (auto-collapses)
- Only one analysis tool active at a time

### Workflow Integration:
- Use measurement tool before requesting excavation analysis from AI
- Take screenshots of heatmaps for reports
- Cross-reference coordinates with chat queries
- Use cross-sections to guide deeper AI analysis

### UI Behavior:
- All tools are **mutually exclusive** (activating one deactivates others)
- Filters auto-minimize when you start typing in chat
- Tool results appear in top-right corner (non-blocking)
- Click tool button again to deactivate

### Mobile Considerations:
- All tools work on mobile/tablet
- Clustering especially helpful on mobile
- Coordinate display easy for field use
- Touch-friendly controls

---

## 🔧 Technical Integration

### Backend Requirements:
All tools currently use **mock data** but are ready for integration:

1. **Heatmap Data**: Connect to `GET /api/heatmap/{projectId}?type=settlement|groundwater|strength`
2. **Cross-Section**: Query `GET /api/boreholes/intersect?lat1=X&lng1=Y&lat2=X&lng2=Y`
3. **Time Series**: Filter assets by `WHERE date <= selectedDate`
4. **Coordinate Systems**: Add UTM/local grid conversion service if needed

### External Libraries:
- **Leaflet.js** (v1.9.4): Core mapping
- **Leaflet.markercluster** (v1.5.3): Clustering functionality
- All imported via CDN (see globals.css)

### Customization:
- Grid spacing: Edit `gridSpacing` in leaflet-map.tsx (currently 0.005° ≈ 500m)
- Heatmap colors: Edit `heatmapColors` object in leaflet-map.tsx
- Cluster threshold: Edit `enableClustering && filteredAssets.length > 5` condition
- Animation speed: Edit `setInterval` duration (currently 1000ms = 1 month/second)

---

## 📊 Data Format Examples

### Heatmap Data Structure:
```json
{
  "type": "settlement",
  "points": [
    {
      "lat": 51.5154,
      "lng": -0.1755,
      "value": 12.5,
      "unit": "mm",
      "timestamp": "2024-03-15"
    }
  ]
}
```

### Cross-Section Intersections:
```json
{
  "transect": {
    "start": {"lat": 51.5154, "lng": -0.1755},
    "end": {"lat": 51.5164, "lng": -0.1765},
    "distance": 1234.5
  },
  "intersectingAssets": [
    {"id": "bh-001", "name": "BH-PAD-001", "distance": 245.0},
    {"id": "bh-003", "name": "BH-PAD-003", "distance": 890.5}
  ]
}
```

---

## 🚀 Future Enhancements

Potential additions discussed but not yet implemented:

- **Elevation Profile**: Show actual terrain/subsurface elevation along cross-section
- **3D Visualization**: Toggle between 2D and 3D terrain view
- **Custom Coordinate Systems**: Support local grid systems and transformations
- **Export Tools**: Save measurements/sections as GeoJSON or DXF
- **Layer Comparison**: Swipe between time periods or data layers
- **Field GPS Integration**: Show live surveyor location
- **Photo Geo-tagging**: Drop photos on map with coordinates

---

## 📞 Support

For questions about map analysis tools:
- See `/guidelines/Guidelines.md` for general integration guidance
- See `/guidelines/QUICK_REFERENCE.md` for UI component reference
- See `/DEPLOYMENT.md` for production deployment

**Last Updated:** January 2025