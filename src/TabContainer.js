// TabContainer.js
import React from 'react';
import './TabContainer.css';

const TabContainer = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      <button
        className={`tab-button ${activeTab === 'district' ? 'active-tab' : ''}`}
        onClick={() => onTabChange('district')}
      >
        District Map
      </button>
      <button
        className={`tab-button ${activeTab === 'schools' ? 'active-tab' : ''}`}
        onClick={() => onTabChange('schools')}
      >
        Schools Table
      </button>
    </div>
  );
};

export default TabContainer;
