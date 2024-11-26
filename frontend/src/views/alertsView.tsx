// App.tsx
import React from 'react';
import FilterForm from '../components/filterCreate';
import FilterList from '../components/filterList';
import AlertList from '../components/alertList';
import '../assets/css/viewsCss/alertsView.css';

const alertsView: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <FilterForm />
            <FilterList />
            <AlertList />
        </div>
    );
};

export default alertsView;
