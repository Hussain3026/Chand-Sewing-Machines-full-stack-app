import React, { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPicker({ onLocationSelect, initialPosition }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [address, setAddress] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const result = {
          line1: [a.house_number, a.road, a.neighbourhood].filter(Boolean).join(", "),
          city: a.city || a.town || a.village || a.county || "",
          state: a.state || "",
          pincode: a.postcode || "",
          lat,
          lng,
        };
        setAddress(result);
        return result;
      }
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
    return null;
  }, []);

  const placeMarker = useCallback(
    async (lat, lng, zoom) => {
      if (!mapInstance.current) return;

      if (markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
      } else {
        markerInstance.current = L.marker([lat, lng], {
          icon: markerIcon,
          draggable: true,
        }).addTo(mapInstance.current);

        markerInstance.current.on("dragend", async (e) => {
          const pos = e.target.getLatLng();
          const result = await reverseGeocode(pos.lat, pos.lng);
          if (result && onLocationSelect) onLocationSelect(result);
        });
      }

      mapInstance.current.setView([lat, lng], zoom || 15);
      const result = await reverseGeocode(lat, lng);
      if (result && onLocationSelect) onLocationSelect(result);
    },
    [reverseGeocode, onLocationSelect]
  );

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const startPos = initialPosition
      ? [initialPosition.lat, initialPosition.lng]
      : DEFAULT_CENTER;
    const startZoom = initialPosition ? 15 : DEFAULT_ZOOM;

    mapInstance.current = L.map(mapRef.current, {
      center: startPos,
      zoom: startZoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    mapInstance.current.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      await placeMarker(lat, lng, 15);
    });

    if (initialPosition) {
      placeMarker(initialPosition.lat, initialPosition.lng, 15);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput
        )}&limit=1&countrycodes=in`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        await placeMarker(parseFloat(lat), parseFloat(lon), 15);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="map-picker">
      <form onSubmit={handleSearch} className="map-search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search your address (e.g. Sector 5, Noida)..."
          className="map-search-input"
        />
        <button
          type="submit"
          className="btn-buy-now"
          style={{ padding: "10px 16px" }}
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      <div ref={mapRef} className="leaflet-map-container" />

      {address && (
        <div className="map-selected-info">
          <p>
            <strong>Selected Address:</strong>
          </p>
          <p>
            {[address.line1, address.city, address.state, address.pincode]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      <p className="map-hint">
        Click on the map or drag the marker to select your exact location
      </p>
    </div>
  );
}
