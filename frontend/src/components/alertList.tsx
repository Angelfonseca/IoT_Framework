// AlertList.tsx
import React, { useEffect, useState } from 'react';
import { Alert } from '../types';
import apiService from '../services/api.service';

const AlertList: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await apiService.get<Alert[]>('/alerts/getall');
            setAlerts(data);
        };
        fetchAlerts();
    }, []);

    return (
        <div>
            <h3>Visualización de Alertas</h3>
            {alerts.map((alert, index) => (
                <div key={index} style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>
                    <p>{alert.description}</p>
                    <p>Device: {alert.device}</p>
                    <p>Module: {alert.module}</p>
                    <p>Resolved: {alert.resolved ? "Yes" : "No"}</p>
                </div>
            ))}
        </div>
    );
};

export default AlertList;
