import React from 'react';
import { GeoJSON, useLeafletContext } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ geojson, lahoreGeojson, attockGeojson, selectedDistrict, handleFeatureClick }) => {
  const { map } = useLeafletContext();  // Use useLeafletContext() to access the map context

  const [districtGeojson, setDistrictGeojson] = React.useState(null);
  const [isDistrictSelected, setIsDistrictSelected] = React.useState(false);
  
  React.useEffect(() => {
    setIsDistrictSelected( selectedDistrict?.districts === 'Bahawalnagar'||selectedDistrict?.districts === 'Lahore' || selectedDistrict?.districts === 'Attock');
    if (selectedDistrict) {
      if (selectedDistrict.districts === 'Lahore') {
        setDistrictGeojson(lahoreGeojson);
      } else if (selectedDistrict.districts === 'Attock') {
        setDistrictGeojson(attockGeojson);

      }
      else {
        setDistrictGeojson(null);
      }
    }
  }, [selectedDistrict, lahoreGeojson, attockGeojson]);

  const districtStyle = (feature) => {
    return {
      fillColor: feature.properties.districts === selectedDistrict?.districts ? '#FFA07A' : '#FFF',
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.3
    };
  };

  if (!districtGeojson) return null;

  return (
    <>
      <GeoJSON
        data={districtGeojson}
        style={districtStyle}
        onEachFeature={(feature, layer) => {
          layer.on('click', () => handleFeatureClick(feature, layer));
          
          // Add district label
          const center = layer.getBounds().getCenter();
          const label = L.divIcon({
            className: 'district-label',
            html: feature.properties.districts,
            iconSize: [100, 20],
            iconAnchor: [50, 10]
          });
          L.marker(center, { icon: label, interactive: false }).addTo(map);
        }}
      />
    </>
  );
};

export default MapComponent;
