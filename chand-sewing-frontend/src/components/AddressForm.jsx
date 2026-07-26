import React, { useState } from "react";
import MapPicker from "./MapPicker";

export default function AddressForm({ initialAddress, onAddressChange, showMap = true }) {
  const [form, setForm] = useState(
    initialAddress || {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
      lat: null,
      lng: null,
    }
  );

  const updateField = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (onAddressChange) onAddressChange(updated);
  };

  const handleMapLocation = (mapData) => {
    const updated = {
      ...form,
      line1: mapData.line1 || form.line1,
      city: mapData.city || form.city,
      state: mapData.state || form.state,
      pincode: mapData.pincode || form.pincode,
      lat: mapData.lat,
      lng: mapData.lng,
    };
    setForm(updated);
    if (onAddressChange) onAddressChange(updated);
  };

  return (
    <div className="address-form">
      {showMap && (
        <div className="address-map-section">
          <MapPicker
            onLocationSelect={handleMapLocation}
            initialPosition={form.lat && form.lng ? { lat: form.lat, lng: form.lng } : null}
          />
        </div>
      )}

      <div className="checkout-grid">
        <label>
          Full Name
          <input
            required
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
        </label>
        <label>
          Phone Number
          <input
            required
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="10-digit mobile number"
          />
        </label>
        <label className="span-2">
          Address
          <input
            required
            value={form.line1}
            onChange={(e) => updateField("line1", e.target.value)}
            placeholder="House no, street, area"
          />
        </label>
        <label>
          City
          <input
            required
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </label>
        <label>
          State
          <input
            required
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </label>
        <label>
          Pincode
          <input
            required
            value={form.pincode}
            onChange={(e) => updateField("pincode", e.target.value)}
            placeholder="6-digit pincode"
          />
        </label>
      </div>
    </div>
  );
}
