import React, { useState, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Complaint } from '../../types';
import { getClosestGHMCWard } from '../../data/ghmcWards';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Layers } from 'lucide-react';

interface CivicMapProps {
  complaints?: Complaint[];
  selectedLocation?: { latitude: number; longitude: number; address?: string };
  onLocationSelect?: (lat: number, lng: number, address: string, ward: string) => void;
  interactive?: boolean;
  height?: string;
  onComplaintSelect?: (complaint: Complaint) => void;
  highlightComplaintId?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

// Map Controller helper to handle zoom buttons
const MapController: React.FC<{
  onReset: () => void;
  center: { lat: number; lng: number };
}> = ({ onReset, center }) => {
  const map = useMap();

  const handleZoom = (delta: number) => {
    if (!map) return;
    const current = map.getZoom() || 12;
    map.setZoom(current + delta);
  };

  const handleReset = () => {
    if (!map) return;
    map.setCenter(center);
    map.setZoom(12);
    onReset();
  };

  return (
    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-md">
      <button
        type="button"
        onClick={() => handleZoom(1)}
        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      <button
        type="button"
        onClick={() => handleZoom(-1)}
        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Center Hyderabad"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};

export const CivicMap: React.FC<CivicMapProps> = ({
  complaints = [],
  selectedLocation,
  onLocationSelect,
  interactive = true,
  height = 'h-80',
  onComplaintSelect,
  highlightComplaintId,
  initialCenter,
  initialZoom = 12,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [activePin, setActivePin] = useState<Complaint | null>(null);
  const [mapError, setMapError] = useState(false);

  // Default center: Hyderabad Municipal Headquarters / Tank Bund (17.3850° N, 78.4867° E)
  const defaultCenter = useMemo(() => {
    if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
      return { lat: selectedLocation.latitude, lng: selectedLocation.longitude };
    }
    if (initialCenter) {
      return initialCenter;
    }
    if (complaints.length > 0 && complaints[0].location) {
      return {
        lat: complaints[0].location.latitude,
        lng: complaints[0].location.longitude,
      };
    }
    return { lat: 17.385, lng: 78.4867 };
  }, [selectedLocation, initialCenter, complaints]);

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return '#f59e0b'; // amber
      case 'Assigned':
        return '#3b82f6'; // blue
      case 'In Progress':
        return '#6366f1'; // indigo
      case 'Resolved':
        return '#10b981'; // emerald
      case 'Rejected':
        return '#ef4444'; // rose
      default:
        return '#2563eb';
    }
  };

  const handleMapClick = useCallback(
    (e: any) => {
      if (!onLocationSelect || !interactive) return;
      const latLng = e.detail?.latLng;
      if (!latLng) return;

      const lat = parseFloat(latLng.lat.toFixed(5));
      const lng = parseFloat(latLng.lng.toFixed(5));

      // Match closest official GHMC ward using distance algorithm
      const closestWard = getClosestGHMCWard(lat, lng);
      const wardLabel = `Ward ${closestWard.wardNumber} - ${closestWard.wardName} (${closestWard.zone} Zone)`;
      const address = `Near ${closestWard.wardName} Sector, ${closestWard.circle}, GHMC`;

      onLocationSelect(lat, lng, address, wardLabel);
    },
    [onLocationSelect, interactive]
  );

  // If no API key is available or map error triggered, show an informative message + vector preview
  if (!apiKey || mapError) {
    return (
      <div
        className={`relative w-full ${height} overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-blue-50/50 to-slate-100 p-4 flex flex-col items-center justify-center text-center`}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-xs">
          <AlertTriangle size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-800">
          {!apiKey ? 'Google Maps API Key Required' : 'Interactive Map Loading Notice'}
        </h4>
        <p className="text-xs text-slate-500 max-w-md mt-1 mb-3">
          {!apiKey
            ? 'Add VITE_GOOGLE_MAPS_API_KEY to your environment to activate live Google Maps GIS for Hyderabad.'
            : 'Using cached GIS coordinates. All GHMC ward boundaries and coordinates remain active.'}
        </p>

        {/* Coords indicator */}
        {selectedLocation && (
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono shadow-xs">
            📍 Pinned: {selectedLocation.latitude}° N, {selectedLocation.longitude}° E
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${height} overflow-hidden rounded-2xl border border-slate-200 shadow-xs select-none`}
    >
      <APIProvider
        apiKey={apiKey}
        onError={() => setMapError(true)}
      >
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={initialZoom}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
          onClick={handleMapClick}
          gestureHandling={interactive ? 'auto' : 'none'}
        >
          <MapController onReset={() => setActivePin(null)} center={defaultCenter} />

          {/* Render Complaints Markers */}
          {complaints.map((c) => {
            const isHighlighted = highlightComplaintId === c.id;
            const color = getStatusBgColor(c.status);

            return (
              <AdvancedMarker
                key={c.id}
                position={{ lat: c.location.latitude, lng: c.location.longitude }}
                onClick={() => {
                  setActivePin(c);
                  if (onComplaintSelect) onComplaintSelect(c);
                }}
                title={c.title}
              >
                <div
                  className={`relative flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-125 ${
                    isHighlighted ? 'scale-125 z-30' : 'z-10'
                  }`}
                >
                  {/* Outer pulse circle for Critical priority or Highlighted */}
                  {(isHighlighted || c.priority === 'Critical') && (
                    <span
                      className="absolute w-8 h-8 rounded-full animate-ping opacity-60"
                      style={{ backgroundColor: color }}
                    />
                  )}
                  {/* Pin Body */}
                  <div
                    className="w-7 h-7 rounded-full text-white shadow-lg flex items-center justify-center border-2 border-white font-extrabold text-[11px]"
                    style={{ backgroundColor: color }}
                  >
                    <MapPin size={15} />
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Selected GPS location marker in Report Issue page */}
          {selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
            <AdvancedMarker
              position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
              title="Selected Issue Location"
            >
              <div className="relative flex items-center justify-center cursor-pointer z-40">
                <span className="absolute w-9 h-9 rounded-full bg-blue-600/30 animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center border-2 border-white font-black text-xs">
                  <MapPin size={16} />
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* InfoWindow for Active Selected Complaint */}
          {activePin && (
            <InfoWindow
              position={{ lat: activePin.location.latitude, lng: activePin.location.longitude }}
              onCloseClick={() => setActivePin(null)}
            >
              <div className="p-1 max-w-xs text-slate-900 font-sans">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-slate-500">
                    {activePin.id}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${getStatusBgColor(activePin.status)}15`,
                      color: getStatusBgColor(activePin.status),
                    }}
                  >
                    {activePin.status}
                  </span>
                </div>

                {activePin.images && activePin.images.length > 0 && (
                  <div className="mb-1.5 rounded-lg overflow-hidden h-24 w-full border border-slate-200 bg-slate-100">
                    <img
                      src={activePin.images[0]}
                      alt={activePin.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {activePin.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {activePin.location.address}
                </p>

                {activePin.resolutionEvidence?.evidenceImages && activePin.resolutionEvidence.evidenceImages.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span>✓ Resolution evidence attached</span>
                  </div>
                )}

                <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="font-medium text-slate-500">{activePin.categoryName}</span>
                  <span className="font-semibold text-blue-700">
                    {activePin.location.wardNumber || 'GHMC Ward'}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-md">
        <span className="font-bold text-slate-800 text-[11px]">Legend:</span>
        <span className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Submitted
        </span>
        <span className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          Assigned
        </span>
        <span className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          In Progress
        </span>
        <span className="flex items-center gap-1 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Resolved
        </span>
      </div>

      {/* Bottom Interactive Hint */}
      {interactive && onLocationSelect && (
        <div className="absolute bottom-3 right-3 z-10 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
          <Navigation size={12} className="text-teal-400" />
          <span>Click anywhere on map to drop Hyderabad GPS pin</span>
        </div>
      )}
    </div>
  );
};
