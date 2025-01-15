import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DistrictMap.css";

import { Home } from "lucide-react";

// Fix for default marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const getDistrictColor = (districtName) => {
  const colors = [
    "#FF9AA2",
    "#FFB7B2",
    "#FFDAC1",
    "#E2F0CB",
    "#B5EAD7",
    "#C7CEEA",
    "#F8B195",
    "#F67280",
    "#C06C84",
    "#6C5B7B",
    "#89C4F4",
    "#B1E8C7",
    "#F9D89C",
    "#98AFC7",
    "#B0A8B9",
  ];

  // Use hash function to consistently assign colors to districts
  const hash = districtName.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

const ZoomToDistrict = ({ selectedDistrict, geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedDistrict && geojson) {
      const feature = geojson.features.find(
        (f) =>
          f.properties.districts ===
          (typeof selectedDistrict === "string"
            ? selectedDistrict
            : selectedDistrict.districts)
      );

      if (feature) {
        const layer = L.geoJSON(feature);
        const bounds = layer.getBounds();

        map.flyToBounds(bounds, {
          padding: [50, 50],
          duration: 1,
          easeLinearity: 0.5,
        });
      }
    }
  }, [selectedDistrict, geojson, map]);

  return null;
};

const SchoolMarkers = ({ districtGeojson, isDistrictSelected, map }) => {
  const currentZoom = map.getZoom();
  const isVisible = currentZoom >= 10 || isDistrictSelected;

  if (!isVisible || !districtGeojson) return null;

  return districtGeojson.features.map((feature) => {
    const latitude = feature.properties.Latitude;
    const longitude = parseFloat(feature.properties.Longitude);

    return (
      <Marker
        key={feature.properties.EMIS_Code}
        position={[latitude, longitude]}
      >
        <Popup>
          <div className="school-popup">
            <h3>{feature.properties.Name}</h3>
            <p>
              <strong>Village:</strong> {feature.properties.Village}
            </p>
            <p>
              <strong>EMIS Code:</strong> {feature.properties.EMIS_Code}
            </p>
            <p>
              <strong>Location:</strong> {latitude.toFixed(6)},{" "}
              {longitude.toFixed(6)}
            </p>
            <p>
              <a
                href={`https://www.google.com/maps/place/${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="direction-link"
              >
                View Google Map
              </a>
            </p>
          </div>
        </Popup>
      </Marker>
    );
  });
};

const MapComponent = ({
  geojson,
  lahoreGeojson,
  attockGeojson,
  khushabGeojson,
  bahawalnagarGeojson,
  bahawalpurGeojson,
  bhakkarGeojson,
  dgKhanGeojson,
  faisalabadGeojson,
  gujranwalaGeojson,
  jhangGeojson,
  khanewalGeojson,
  layyahGeojson,
  sargodhaGeojson,
  sheikhupuraGeojson,
  vehariGeojson,
  rahimYarKhanGeojson,
  rajanPurGeojson,
  mandiBahaudinGeojson,
  multanGeojson,
  muzaffargarhGeojson,
  sahiwalGeojson,
  selectedDistrict,


  lodhranGeojson,
nankanaSahibGeojson,
okaraGeojson,
pakpattanGeojson,
taunsaGeojson,
  handleFeatureClick
}) => {
  const map = useMap();
  const [districtGeojson, setDistrictGeojson] = useState(null);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);

  useEffect(() => {
    if (selectedDistrict) {
      setTileUrl(
        "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      );
    } else {
      setTileUrl("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png");
    }
    if (selectedDistrict) {
      console.log("selectedDistrict :",selectedDistrict);
      const districtName =
        typeof selectedDistrict === "string"
          ? selectedDistrict
          : selectedDistrict.districts;

          console.log("selectedDistrict:",districtName)
      setIsDistrictSelected(
        [
          "LAHORE",
          "ATTOCK",
          "KHUSHAB",
          "BAHAWALNAGAR",
          "BHAKKAR",
          "BAHAWALPUR",
          "DERA GHAZI KHAN",
          "FAISALABAD",
          "GUJRANWALA",
          "JHANG",
          "KHANEWAL",
          "LAYYAH",
          "SARGODHA",
          "SHEIKHUPURA",
          "VEHARI",
          "RAHIM YAR KHAN",
          "RAJANPUR",
          "MULTAN",
          "MUZAFFARGARH",
          "SAHIWAL",
          "MANDI BAHAUDDIN",
          "LODRHAN",
"NANKANA SAHIB",
"OKARA",
"PAKPATTAN",
"TAUNSA"
        ].includes(districtName)
      );

      switch (districtName) {
      case "LAHORE":
    setDistrictGeojson(lahoreGeojson);
    break;
case "BAHAWALNAGAR":
    setDistrictGeojson(bahawalnagarGeojson);
    break;
case "BAHAWALPUR":
    setDistrictGeojson(bahawalpurGeojson);
    break;
case "BHAKKAR":
    setDistrictGeojson(bhakkarGeojson);
    break;
case "DERA GHAZI KHAN":
    setDistrictGeojson(dgKhanGeojson);
    break;
case "FAISALABAD":
    setDistrictGeojson(faisalabadGeojson);
    break;
case "GUJRANWALA":
    setDistrictGeojson(gujranwalaGeojson);
    break;
case "JHANG":
    setDistrictGeojson(jhangGeojson);
    break;
case "KHANEWAL":
    setDistrictGeojson(khanewalGeojson);
    break;
case "LAYYAH":
    setDistrictGeojson(layyahGeojson);
    break;
case "SARGODHA":
    setDistrictGeojson(sargodhaGeojson);
    break;
case "SHEIKHUPURA":
    setDistrictGeojson(sheikhupuraGeojson);
    break;
case "VEHARI":
    setDistrictGeojson(vehariGeojson);
    break;
case "ATTOCK":
    setDistrictGeojson(attockGeojson);
    break;
case "KHUSHAB":
    setDistrictGeojson(khushabGeojson);
    break;
case "RAHIM YAR KHAN":
    setDistrictGeojson(rahimYarKhanGeojson);
    break;
case "MANDI BAHAUDDIN":
    setDistrictGeojson(mandiBahaudinGeojson); // Mismatch fixed
    break;
case "MULTAN":
    setDistrictGeojson(multanGeojson);
    break;
case "MUZAFFARGARH":
    setDistrictGeojson(muzaffargarhGeojson);
    break;
case "RAJANPUR":
    setDistrictGeojson(rajanPurGeojson);
    break;
case "SAHIWAL":
    setDistrictGeojson(sahiwalGeojson);
    break;
    case "LODRHAN":
    setDistrictGeojson(lodhranGeojson);
    break;
case "NANKANA SAHIB":
    setDistrictGeojson(nankanaSahibGeojson);
    break;
case "OKARA":
    setDistrictGeojson(okaraGeojson);
    break;
case "PAKPATTAN":
    setDistrictGeojson(pakpattanGeojson);
    break;
case "TAUNSA":
    setDistrictGeojson(taunsaGeojson);
    break;


        default:
          setDistrictGeojson(null);
          break;
      }
    } else {
      setIsDistrictSelected(false);
    }
  }, [
    selectedDistrict,
    bahawalnagarGeojson,
    bahawalpurGeojson,
    bhakkarGeojson,
    dgKhanGeojson,
    faisalabadGeojson,
    gujranwalaGeojson,
    jhangGeojson,
    khanewalGeojson,
    layyahGeojson,
    sargodhaGeojson,
    sheikhupuraGeojson,
    vehariGeojson,
    lahoreGeojson,
    attockGeojson,
    khushabGeojson,
    rahimYarKhanGeojson,
    mandiBahaudinGeojson,
    multanGeojson,
    muzaffargarhGeojson,
    rajanPurGeojson,
    sahiwalGeojson,lodhranGeojson,
    nankanaSahibGeojson,
    okaraGeojson,
    pakpattanGeojson,
    taunsaGeojson
    

  ]);

  const districtStyle = (feature) => {
    const districtName = feature.properties.districts;
    const isSelected =
      selectedDistrict &&
      (typeof selectedDistrict === "string"
        ? selectedDistrict === districtName
        : selectedDistrict.districts === districtName);

    if (selectedDistrict) {
      return {
        weight: isSelected ? 2 : 1,
        opacity: 1,
        color: isSelected ? "#3b82f6" : "#666",
        fillOpacity: 0,
        dashArray: isSelected ? "" : "3",
      };
    }

    return {
      fillColor: getDistrictColor(districtName),
      weight: 1,
      opacity: 1,
      color: "#fff",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    const label = L.divIcon({
      className: "district-label",
      html: `<div class="label-text">${feature.properties.districts}</div>`,
    });
    const center = layer.getBounds().getCenter();
    const labelMarker = L.marker(center, {
      icon: label,
      zIndexOffset: 1000,
    });
    if (!selectedDistrict) {
      labelMarker.addTo(map);
    }
    map.on("click", () => {
      map.removeLayer(labelMarker);
    });
    layer.on({
      click: () => handleFeatureClick(feature, layer),
      mouseover: (e) => {
        if (!selectedDistrict) {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: "#666",
            fillOpacity: 0.9,
          });
        }
      },
      mouseout: (e) => {
        if (!selectedDistrict) {
          const layer = e.target;
          layer.setStyle({ weight: 1, color: "#fff", fillOpacity: 0.7 });
        }
      },
    });
  };

  const [tileUrl, setTileUrl] = useState(
    "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
  );
  return (
    <>
      <TileLayer url={tileUrl} />

      <GeoJSON
        key={selectedDistrict ? "selected" : "default"} // Force re-render when selection changes
        data={geojson}
        style={districtStyle}
        onEachFeature={onEachFeature}
      />

      <SchoolMarkers
        districtGeojson={districtGeojson}
        isDistrictSelected={isDistrictSelected}
        map={map}
      />

      <ZoomToDistrict selectedDistrict={selectedDistrict} geojson={geojson} />
    </>
  );
};

const DistrictMap = () => {
  const [geojson, setGeojson] = useState(null);
  const [lahoreGeojson, setLahoreGeojson] = useState(null);
  const [attockGeojson, setAttockGeojson] = useState(null);
  const [khushabGeojson, setKhushabGeojson] = useState(null);
// ===============================================================

const [mandiBahaudinGeojson, setMandiBahaudinGeojson] = useState(null);
const [multanGeojson, setMultanGeojson] = useState(null);
const [muzaffargarhGeojson, setMuzaffargarhGeojson] = useState(null);
const [rahimYarKhanGeojson, setRahimYarKhanGeojson] = useState(null);
const [rajanPurGeojson, setRajanPurGeojson] = useState(null);
const [sahiwalGeojson, setSahiwalGeojson] = useState(null);



const [lodhranGeojson, setLodhranGeojson] = useState(null);
const [nankanaSahibGeojson, setNankanaSahibGeojson] = useState(null);
const [okaraGeojson, setOkaraGeojson] = useState(null);
const [pakpattanGeojson, setPakpattanGeojson] = useState(null);
const [taunsaGeojson, setTaunsaGeojson] = useState(null);


  const [bahawalnagarGeojson, setBahawalnagarGeojson] = useState(null);
  const [bahawalpurGeojson, setBahawalpurGeojson] = useState(null);
  const [bhakkarGeojson, setBhakkarGeojson] = useState(null);
  const [dgKhanGeojson, setDgKhanGeojson] = useState(null);
  const [faisalabadGeojson, setFaisalabadGeojson] = useState(null);
  const [gujranwalaGeojson, setGujranwalaGeojson] = useState(null);
  const [jhangGeojson, setJhangGeojson] = useState(null);
  const [khanewalGeojson, setKhanewalGeojson] = useState(null);
  const [layyahGeojson, setLayyahGeojson] = useState(null);
  const [sargodhaGeojson, setSargodhaGeojson] = useState(null);
  const [sheikhupuraGeojson, setSheikhupuraGeojson] = useState(null);
  const [vehariGeojson, setVehariGeojson] = useState(null);

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [districts, setDistricts] = useState([]);
  const [isSidebarVisible] = useState(true);

  // const [bahawalnagar, setBahawalnagar] = useState(null);

  const handleFeatureClick = (feature, layer) => {
    setSelectedDistrict(feature.properties);
  };

  const handleHomeClick = () => {
    window.location.reload();
  };

  // const toggleSidebar = () => {
  //   setSidebarVisible(!isSidebarVisible);
  // };

  useEffect(() => {
    fetch("./districts.geojson")
      .then((response) => response.json())
      .then((data) => {
        setDistricts(
          data.features.map((feature) => feature.properties.districts)
        );
        setGeojson(data);
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));

    fetch('./Bahawalnagar.xlsx.geojson')
      .then((response) => response.json())
      .then((data) => setBahawalnagarGeojson(data))
      .catch((error) => console.error('Error loading Bahawalnagar GeoJSON:', error));

    fetch("./Lahore.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setLahoreGeojson(data))
      .catch((error) => console.error("Error loading Lahore GeoJSON:", error));

    
    fetch("./Mandi Bahaudin.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setMandiBahaudinGeojson(data))
      .catch((error) => console.error("Error loading Mandi Bahaudin GeoJSON:", error));
    
    fetch("./Multan.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setMultanGeojson(data))
      .catch((error) => console.error("Error loading Multan GeoJSON:", error));
    
    fetch("./Muzaffargarh.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setMuzaffargarhGeojson(data))
      .catch((error) => console.error("Error loading Muzaffargarh GeoJSON:", error));
    
    fetch("./Rahim Yar Khan.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setRahimYarKhanGeojson(data))
      .catch((error) => console.error("Error loading Rahim Yar Khan GeoJSON:", error));
    
    fetch("./Rajan Pur.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setRajanPurGeojson(data))
      .catch((error) => console.error("Error loading Rajan Pur GeoJSON:", error));
    
    fetch("./Sahiwal.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setSahiwalGeojson(data))
      .catch((error) => console.error("Error loading Sahiwal GeoJSON:", error));
    





// Lodhran
fetch("./Lodhran.xlsx.geojson")
  .then((response) => response.json())
  .then((data) => setLodhranGeojson(data))
  .catch((error) => console.error("Error loading Lodhran GeoJSON:", error));

// Nankana Sahib
fetch("./Nankana Sahib.xlsx.geojson")
  .then((response) => response.json())
  .then((data) => setNankanaSahibGeojson(data))
  .catch((error) => console.error("Error loading Nankana Sahib GeoJSON:", error));

// Okara
fetch("./Okara.xlsx.geojson")
  .then((response) => response.json())
  .then((data) => setOkaraGeojson(data))
  .catch((error) => console.error("Error loading Okara GeoJSON:", error));

// Pakpattan
fetch("./Pakpattan.xlsx.geojson")
  .then((response) => response.json())
  .then((data) => setPakpattanGeojson(data))
  .catch((error) => console.error("Error loading Pakpattan GeoJSON:", error));

// Taunsa
fetch("./Taunsa.xlsx.geojson")
  .then((response) => response.json())
  .then((data) => setTaunsaGeojson(data))
  .catch((error) => console.error("Error loading Taunsa GeoJSON:", error));












    fetch("./Attock.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setAttockGeojson(data))
      .catch((error) => console.error("Error loading Attock GeoJSON:", error));

    fetch("./Khushab.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setKhushabGeojson(data))
      .catch((error) => console.error("Error loading Khushab GeoJSON:", error));



    fetch("./Attock.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setAttockGeojson(data))
      .catch((error) => console.error("Error loading Attock GeoJSON:", error));

    fetch("./Bahawalnagar.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setBahawalnagarGeojson(data))
      .catch((error) =>
        console.error("Error loading Bahawalnagar GeoJSON:", error)
      );

    fetch("./Bahawalpur.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setBahawalpurGeojson(data))
      .catch((error) =>
        console.error("Error loading Bahawalpur GeoJSON:", error)
      );

    fetch("./Bhakkar.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setBhakkarGeojson(data))
      .catch((error) => console.error("Error loading Bhakkar GeoJSON:", error));

    fetch("./DG Khan.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setDgKhanGeojson(data))
      .catch((error) => console.error("Error loading DG Khan GeoJSON:", error));

    fetch("./Faisalabad.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setFaisalabadGeojson(data))
      .catch((error) =>
        console.error("Error loading Faisalabad GeoJSON:", error)
      );

    fetch("./Gujranwala.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setGujranwalaGeojson(data))
      .catch((error) =>
        console.error("Error loading Gujranwala GeoJSON:", error)
      );

    fetch("./Jhang.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setJhangGeojson(data))
      .catch((error) => console.error("Error loading Jhang GeoJSON:", error));

    fetch("./Khanewal.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setKhanewalGeojson(data))
      .catch((error) =>
        console.error("Error loading Khanewal GeoJSON:", error)
      );

    fetch("./Layyah.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setLayyahGeojson(data))
      .catch((error) => console.error("Error loading Layyah GeoJSON:", error));

    fetch("./Sargodha.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setSargodhaGeojson(data))
      .catch((error) =>
        console.error("Error loading Sargodha GeoJSON:", error)
      );

    fetch("./Sheikhupura.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setSheikhupuraGeojson(data))
      .catch((error) =>
        console.error("Error loading Sheikhupura GeoJSON:", error)
      );

    fetch("./Vehari.xlsx.geojson")
      .then((response) => response.json())
      .then((data) => setVehariGeojson(data))
      .catch((error) => console.error("Error loading Vehari GeoJSON:", error));
  }, []);

  const handleSidebarSelect = (district) => {
    const feature = geojson.features.find(
      (f) => f.properties.districts === district
    );
    if (feature) {
      setSelectedDistrict(feature.properties);
    }
  };

  if (
    !geojson ||
    !lahoreGeojson ||
    !attockGeojson ||
    !khushabGeojson ||
    !bahawalnagarGeojson ||
    !bahawalpurGeojson ||
    !bhakkarGeojson ||
    !dgKhanGeojson ||
    !faisalabadGeojson ||
    !gujranwalaGeojson ||
    !jhangGeojson ||
    !khanewalGeojson ||
    !layyahGeojson ||
    !sargodhaGeojson ||
    !sheikhupuraGeojson ||
    !vehariGeojson ||
    !mandiBahaudinGeojson ||
    !multanGeojson ||
    !muzaffargarhGeojson ||
    !rahimYarKhanGeojson ||
    !rajanPurGeojson ||
    !sahiwalGeojson ||
    !lodhranGeojson ||
!nankanaSahibGeojson ||
!okaraGeojson ||
!pakpattanGeojson ||
!taunsaGeojson
  ) {
    return <div className="loading-state">Loading map...</div>;
  }

  const DistrictSidebar = ({
    districts,
    onDistrictSelect,
    searchQuery,
    setSearchQuery,
    selectedDistrict,
  }) => (
    <div className={`district-sidebar ${!isSidebarVisible ? "hidden" : ""}`}>
      <div className="sidebar-header">
        <button className="sidebar-button" onClick={handleHomeClick}>
          <Home size={20} />
        </button>
      </div>
      <input
    type="text"
    placeholder="Search district..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    autoComplete="off"
    onKeyDown={(e) => {
        // Keep the input focused when pressing keys other than Enter and Escape
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
        }
    }}
    onFocus={(e) => e.target.select()} // Selects the entire text when input is focused
    onBlur={(e) => e.target.value = searchQuery} // Keeps the focus on the input if it's blurred
/>


     <ul>
  {districts
    .sort()  // Sort districts alphabetically
    .filter((district) =>
      district.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((district, index) => (
      <li
        key={index}
        className={district === selectedDistrict ? "selected" : ""}
        onClick={() => onDistrictSelect(district)}
      >
        {district}
      </li>
    ))}
</ul>

    </div>
  );

  return (
    <div className="map-layout">
      {/* {!isSidebarVisible && (
      <button className="show-sidebar-button" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
    )} */}

      <div className="map-container">
        <MapContainer
          center={[31.5204, 74.3587]}
          zoom={8}
          scrollWheelZoom={true}
        >
          <MapComponent
         geojson={geojson}
         lahoreGeojson={lahoreGeojson}
         attockGeojson={attockGeojson}
         khushabGeojson={khushabGeojson}
         bahawalnagarGeojson={bahawalnagarGeojson}
         bahawalpurGeojson={bahawalpurGeojson}
         bhakkarGeojson={bhakkarGeojson}
         dgKhanGeojson={dgKhanGeojson}
         faisalabadGeojson={faisalabadGeojson}
         gujranwalaGeojson={gujranwalaGeojson}
         jhangGeojson={jhangGeojson}
         khanewalGeojson={khanewalGeojson}
         layyahGeojson={layyahGeojson}
         sargodhaGeojson={sargodhaGeojson}
         sheikhupuraGeojson={sheikhupuraGeojson}
         vehariGeojson={vehariGeojson}
         mandiBahaudinGeojson={mandiBahaudinGeojson}
         multanGeojson={multanGeojson}
         muzaffargarhGeojson={muzaffargarhGeojson}
         rahimYarKhanGeojson={rahimYarKhanGeojson}
         rajanPurGeojson={rajanPurGeojson}
         sahiwalGeojson={sahiwalGeojson}
         selectedDistrict={selectedDistrict}


         lodhranGeojson={lodhranGeojson}
         nankanaSahibGeojson={nankanaSahibGeojson} 
         okaraGeojson={okaraGeojson} 
         pakpattanGeojson={pakpattanGeojson} 
         taunsaGeojson={taunsaGeojson} 



         handleFeatureClick={handleFeatureClick}
          />
        </MapContainer>
      </div>

      <DistrictSidebar
        districts={districts}
        onDistrictSelect={handleSidebarSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {selectedDistrict && (
        <div className="district-info">
          <h3 className="text-xl font-bold mb-4">
            {typeof selectedDistrict === "string"
              ? selectedDistrict
              : selectedDistrict.districts}
          </h3>
          <div className="space-y-2">
            {/* <p>
              <strong>Province/Territory:</strong>{" "}
              {selectedDistrict.province_territory}
            </p> */}
            {/* <p>
              <strong>Status:</strong> {selectedDistrict.status}
            </p>
            <p>
              <strong>District Agency:</strong>{" "}
              {selectedDistrict.district_agency}
            </p> */}
            {/* {selectedDistrict.shape_area && (
              <p>
                <strong>Area:</strong>{" "}
                {parseFloat(selectedDistrict.shape_area).toFixed(3)}
              </p>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictMap;
