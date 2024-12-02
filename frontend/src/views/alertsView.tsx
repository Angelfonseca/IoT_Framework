import React from 'react';
import FilterForm from '../components/filterCreate';
import FilterList from '../components/filterList';
import AlertList from '../components/alertList';
import '../assets/css/viewsCss/alertsView.css';

const AlertsView: React.FC = () => {
    return (
        <div className="alerts-view-container">
            <h2>Alerts</h2>
            <FilterForm className="alerts-view-component" />
            <FilterList className="alerts-view-component" />
            <AlertList className="alerts-view-component" />
        </div>
    );
};

export default AlertsView;