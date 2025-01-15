// App.js
import React, { useState } from 'react';
import DistrictMap from './DistrictMap';
import MapSchoolsTable from './mapschoolstable';
import TabContainer from './TabContainer';
import './App.css'; // Importing custom CSS for styling

function App() {
  const [activeTab, setActiveTab] = useState('district');

  const handleTabChange = (tab) => {
    console.log(tab,"tab-----")
    setActiveTab(tab);
  };

  return (
    <div className="app-container">
      <TabContainer activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="content-container">
        {activeTab === 'district' ? <DistrictMap /> : <MapSchoolsTable />}
      </div>
    </div>
  );
}

export default App;
