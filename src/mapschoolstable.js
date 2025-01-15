import React, { useState, useEffect } from "react";

const SchoolLocations = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupedData, setGroupedData] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [allDisLink, setAllDisLink] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalVillages, setTotalVillages] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const distjson = await fetch("./DistrictsListAllSchools.json");
        const districtsData = await distjson.json();
        setAllDisLink(districtsData);

        const response = await fetch("./dataallmaps.kml");
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");
        const placemarks = Array.from(xmlDoc.getElementsByTagName("Placemark"));

        const parsedData = placemarks.map((placemark) => {
          const description =
            placemark.getElementsByTagName("description")[0]?.textContent || "";
          const emisMatch = description.match(/EMIS Code: (\d+)/);
          const emisCode = emisMatch ? emisMatch[1] : "N/A";

          return {
            name:
              placemark.getElementsByTagName("name")[0]?.textContent || "N/A",
            district:
              placemark
                .getElementsByTagName("Data")[1]
                ?.getElementsByTagName("value")[0]?.textContent || "N/A",
            village:
              placemark
                .getElementsByTagName("Data")[2]
                ?.getElementsByTagName("value")[0]?.textContent || "N/A",
            emisCode,
            coordinates:
              placemark.getElementsByTagName("coordinates")[0]?.textContent ||
              "N/A",
          };
        });

        setData(parsedData);

        const grouped = parsedData.reduce((acc, item) => {
          if (!acc[item.district]) {
            acc[item.district] = [];
          }
          acc[item.district].push(item);
          return acc;
        }, {});
        // console.log(grouped, "grouped");
 
        



        const villageCount = {};

        // Count occurrences of each village
        parsedData.forEach((item) => {
          const village = item.village.trim();
          villageCount[village] = (villageCount[village] || 0) + 1;
        });
        
        // Log duplicates
        Object.entries(villageCount).forEach(([village, count]) => {
          if (count > 1) {
            console.log(`${village} is duplicated ${count} times.`);
          }
        });










    const uniqueVillages = new Set(parsedData.map((item) => item.village.trim()));

    setTotalVillages(uniqueVillages.size);

        setGroupedData(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Reset pagination when district or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDistrict, searchTerm]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setCurrentPage(1); // Reset to first page when district changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };
  console.log(groupedData[selectedDistrict],"selectedDistrict");
  const filteredData = selectedDistrict
  ? {
      [selectedDistrict]:
        groupedData[selectedDistrict]?.filter((item) => {
          if (!item) return false;
          
          const normalizedSearchTerm = (searchTerm || '').toLowerCase().trim();
          if (!normalizedSearchTerm) return true;

          // Normalize the school data
          const schoolName = (item.name || '').toLowerCase().trim();
          const village = (item.village || '').toLowerCase().trim();
          const emisCode = (item.emisCode || '').replace(/\s+/g, "");
          
          // Search terms without GPS/GGPS prefixes
          const searchWithoutPrefix = normalizedSearchTerm
            .replace(/^gps\s*/i, '')
            .replace(/^ggps\s*/i, '');
          
          const nameWithoutPrefix = schoolName
            .replace(/^gps\s*/i, '')
            .replace(/^ggps\s*/i, '');

          return (
            schoolName.includes(normalizedSearchTerm) ||
            nameWithoutPrefix.includes(searchWithoutPrefix) ||
            village.includes(normalizedSearchTerm) ||
            emisCode.includes(normalizedSearchTerm.replace(/\s+/g, ""))
          );
        }) || []
    }
  : Object.entries(groupedData).reduce((acc, [district, schools]) => {
      const filteredSchools = schools.filter((item) => {
        if (!item) return false;
        
        const normalizedSearchTerm = (searchTerm || '').toLowerCase().trim();
        if (!normalizedSearchTerm) return true;

        // Normalize the school data
        const schoolName = (item.name || '').toLowerCase().trim();
        const village = (item.village || '').toLowerCase().trim();
        const emisCode = (item.emisCode || '').replace(/\s+/g, "");
        
        // Search terms without GPS/GGPS prefixes
        const searchWithoutPrefix = normalizedSearchTerm
          .replace(/^gps\s*/i, '')
          .replace(/^ggps\s*/i, '');
        
        const nameWithoutPrefix = schoolName
          .replace(/^gps\s*/i, '')
          .replace(/^ggps\s*/i, '');

        return (
          schoolName.includes(normalizedSearchTerm) ||
          nameWithoutPrefix.includes(searchWithoutPrefix) ||
          village.includes(normalizedSearchTerm) ||
          emisCode.includes(normalizedSearchTerm.replace(/\s+/g, ""))
        );
      });
      
      if (filteredSchools.length > 0) {
        acc[district] = filteredSchools;
      }
      return acc;
    }, {});

  const openGoogleMaps = (coordinates) => {
    const [longitude, latitude] = coordinates.split(",");
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  const openAllinMap = async (district) => {
    const cleanedDis = district.replace(/\s+/g, "");
    const cleanedDistrictData = allDisLink.find(
      (item) =>
        item.district.replace(/\s+/g, "").toLowerCase() ===
        cleanedDis.toLowerCase()
    );
    if (cleanedDistrictData) {
      window.open(cleanedDistrictData.map_link, "_blank");
    }
  };

  // Pagination calculations
  const flattenedData = Object.values(filteredData).flat();
  const totalItems = flattenedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = flattenedData.slice(indexOfFirstItem, indexOfLastItem);

  const exportToCSV = () => {
    // Prepare CSV header and rows
    const headers = [
      "S.No.",
      "Name",
      "District",
      "Village",
      "EMIS Code",
      "Coordinates",
    ];
  
    const rows = currentItems.map((item, index) => [
      index + 1,
      item.name,
      item.district,
      item.village,
      item.emisCode,
      item.coordinates?.trim() || "N/A", // Trim coordinates or default to "N/A"
    ]);
  
    console.log(rows, "===================");
  
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(",")) // Escape commas
      .join("\n");
  
    // Create a Blob and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
  
    link.href = url;
    link.setAttribute("download", "Schools_Data.csv");
    document.body.appendChild(link);
    link.click();
  
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="table-container">
     
     







     <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>Total Schools</h3>
            <div className="value">445</div>
          </div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
              <path d="M2 22V8.2L12 2L22 8.2V22H17V13H7V22H2Z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>Total Districts</h3>
            <div className="value">{Object.keys(groupedData).length}</div>
          </div>
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      </div>


      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-info">
            <h3>Total Villages</h3>
            <div className="value">{totalVillages}</div>
          </div>
          <div className="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
              <path d="M2 22V8.2L12 2L22 8.2V22H17V13H7V22H2Z"/>
            </svg>
          </div>
        </div>
      </div>



      </div>


    













      <div className="controls-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search by School or Village or EMIS Code"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          className="district-select"
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="">All Districts</option>
          {Object.keys(groupedData).map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>

        <div className="stats-display">
          Total Schools: {totalItems}
          {selectedDistrict && ` in ${selectedDistrict}`}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="schools-table">
          <thead>
            <tr>
              <th>SR No</th>
              <th>Name</th>
              <th>District</th>
              <th>Village</th>
              <th>EMIS Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.district}</td>
                <td>{item.village}</td>
                <td>{item.emisCode}</td>
                <td>
                  <button
                    className="map-button"
                    onClick={() => openGoogleMaps(item.coordinates)}
                  >
                    View Map
                  </button>
                  <button
                    className="map-button"
                    onClick={() => openAllinMap(item.district)}
                  >
                    View All
                  </button>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No schools found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {totalItems > 0 ? indexOfFirstItem + 1 : 0} to{" "}
          {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolLocations;
