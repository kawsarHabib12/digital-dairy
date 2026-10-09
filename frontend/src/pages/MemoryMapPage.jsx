import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, Navigation, BookOpen, Calendar, ArrowRight, Compass } from 'lucide-react';
import api from '../services/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import MoodBadge from '../components/MoodBadge';

export default function MemoryMapPage() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch user locations
  useEffect(() => {
    api.get('/locations')
      .then((res) => {
        const data = res.data.data || [];
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load locations', err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance if not exists
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([23.8103, 90.4125], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (locations.length === 0) return;

    const bounds = [];

    // Add markers for each location
    locations.forEach((loc) => {
      const lat = loc.latitude || 23.8103;
      const lng = loc.longitude || 90.4125;
      bounds.push([lat, lng]);

      // Custom HTML pin with memory count
      const customIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `<div class="custom-marker-pin" style="width: 32px; height: 32px; line-height: 28px; text-align: center;">${loc.count}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Create popup content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1';
      popupDiv.innerHTML = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif;">
          <h4 style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #1c1917;">${loc.locationName}</h4>
          <p style="font-size: 11px; color: #78716c; margin-bottom: 8px;">${loc.count} ${loc.count === 1 ? 'memory' : 'memories'} recorded here</p>
        </div>
      `;

      marker.bindPopup(popupDiv);
      marker.on('click', () => {
        setSelectedLocation(loc);
      });

      markersRef.current.push(marker);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [locations]);

  // Center on selected location
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    if (mapInstanceRef.current && loc.latitude && loc.longitude) {
      mapInstanceRef.current.setView([loc.latitude, loc.longitude], 13, {
        animate: true,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 bg-parchment-200/80 px-3 py-1 rounded-full mb-2">
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>Geographic Memory Archive</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-diary-ink">
          Your Memory Map
        </h1>
        <p className="text-xs sm:text-sm text-diary-muted">
          Explore visited places and see stories you recorded across the globe.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading your interactive memory map..." />
      ) : locations.length === 0 ? (
        <EmptyState
          title="No locations pinned yet"
          description="Write diary entries with location names and coordinates to see them on your map."
          actionLabel="Write a Memory with Location"
          onAction={() => navigate('/write')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View Canvas (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-diary-border shadow-diary-lg overflow-hidden h-[560px] relative">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
          </div>

          {/* Locations and Selected Memory Panel */}
          <div className="space-y-6">
            {/* Visited Places List */}
            <div className="bg-white rounded-2xl border border-diary-border p-5 shadow-diary max-h-[260px] overflow-y-auto">
              <h3 className="text-xs font-bold uppercase tracking-wider text-diary-muted mb-3">
                Visited Destinations ({locations.length})
              </h3>
              <div className="space-y-2">
                {locations.map((loc) => {
                  const isSelected = selectedLocation?.locationName === loc.locationName;
                  return (
                    <div
                      key={loc.locationName}
                      onClick={() => handleSelectLocation(loc)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                          : 'bg-parchment-50/50 border-diary-border hover:bg-parchment-100 text-diary-ink'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-800' : 'text-diary-muted'}`} />
                        <span className="font-semibold truncate">{loc.locationName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-white border border-diary-border text-[11px] shrink-0 text-amber-900">
                        {loc.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Location Details Card */}
            {selectedLocation && (
              <div className="bg-white rounded-2xl border border-diary-border p-5 shadow-diary paper-texture">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-diary-border">
                  <div>
                    <h4 className="font-serif font-bold text-base text-diary-ink">
                      {selectedLocation.locationName}
                    </h4>
                    <p className="text-[11px] text-diary-muted">
                      {selectedLocation.count} {selectedLocation.count === 1 ? 'entry' : 'entries'} recorded
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-xs">
                    {selectedLocation.count}
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                  {selectedLocation.memories.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => navigate(`/memories/${m.id}`)}
                      className="p-2.5 rounded-xl border border-diary-border bg-white/90 hover:bg-parchment-100 cursor-pointer transition-colors flex items-center justify-between group text-xs"
                    >
                      <div className="truncate mr-2">
                        <p className="font-medium text-diary-ink group-hover:text-amber-800 truncate">
                          {m.title}
                        </p>
                        <p className="text-[10px] text-diary-muted">
                          {new Date(m.memoryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <MoodBadge mood={m.mood} />
                        <ArrowRight className="w-3.5 h-3.5 text-diary-muted group-hover:text-amber-800 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
