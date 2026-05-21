import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const bloodIcon = new L.Icon({
  iconUrl: import.meta.env.VITE_LEAFLET_MARKER_ICON,
  iconRetinaUrl: import.meta.env.VITE_LEAFLET_MARKER_ICON_2X,
  shadowUrl: import.meta.env.VITE_LEAFLET_MARKER_SHADOW,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBounds({ banks }) {
  const map = useMap();

  useEffect(() => {
    const points = banks
      .filter((bank) => bank.latitude !== undefined && bank.longitude !== undefined)
      .map((bank) => [bank.latitude, bank.longitude]);

    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36] });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [banks, map]);

  return null;
}

function BloodBankMap({ banks }) {
  const mappedBanks = banks.filter((bank) => bank.latitude !== undefined && bank.longitude !== undefined);
  const center = mappedBanks.length ? [mappedBanks[0].latitude, mappedBanks[0].longitude] : [10.8505, 76.2711];

  return (
    <div className="map-card">
      <MapContainer center={center} zoom={8} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution={import.meta.env.VITE_MAP_ATTRIBUTION}
          url={import.meta.env.VITE_MAP_TILE_URL}
        />
        <MapBounds banks={mappedBanks} />
        {mappedBanks.map((bank) => (
          <Marker key={bank._id} position={[bank.latitude, bank.longitude]} icon={bloodIcon}>
            <Popup>
              <strong>{bank.name}</strong>
              <br />
              {bank.city}
              <br />
              {bank.openingHours}
              <br />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${bank.name} ${bank.address} ${bank.city}`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BloodBankMap;
