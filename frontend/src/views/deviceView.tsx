import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api.service';
import '../assets/css/viewsCss/deviceView.css'; // Asegúrate de importar el archivo CSS

interface ModulesNames {
    modules: string[];
}

interface LatestModuleData {
    [key: string]: unknown; // Assuming the structure is unknown
}

const DeviceView: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>();
    const [modules, setModules] = useState<string[]>([]);
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [latestData, setLatestData] = useState<LatestModuleData | null>(null);
    const [jsonResponse, setJsonResponse] = useState<Record<string, unknown> | null>(null);
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({ startDate: '', endDate: '' });

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await apiService.get<ModulesNames>('/data/modules');
                setModules(response.modules);
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };
        fetchModules();
    }, [id]);

    const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(e.target.value);
    };

    const handlePostRequest = async () => {
        try {
            const requestBody = { json: selectedModule };
            const response = await apiService.post(`/data/json/${id}`, requestBody);
            setJsonResponse(response);
            alert('Request successfully sent');
        } catch (error) {
            console.error('Error sending POST request:', error);
        }
    };

    const handleGetLatestData = async () => {
        if (!selectedModule) return;
        const module = selectedModule;
        try {
            const response = await apiService.post(`data/latest/${id}`, { module: module });
            setLatestData(response);
        } catch (error) {
            console.error('Error fetching latest module data:', error);
        }
    };

    const handleGetDataByDateRange = async () => {
        if (!selectedModule || !dateRange.startDate || !dateRange.endDate) return;
        const module = selectedModule;
        try {
            const response = await apiService.post(`data/range/${id}`, { dateRange: dateRange, module: module });
            setLatestData(response);
        } catch (error) {
            console.error('Error fetching data by date range:', error);
        }
    };

    return (
        <div className="device-view-container">
            <h1>Device ID: {id}</h1>

            <div className="layout">
                <div className="module-section">
                    <h2>Generar JSON para POST</h2>
                    <textarea
                        readOnly
                        value={jsonResponse ? JSON.stringify(jsonResponse, null, 2) : 'No se ha hecho ninguna petición aún.'}
                        className="json-textarea"
                    />

                    <label htmlFor="moduleSelect">Selecciona un módulo:</label>
                    <select
                        id="moduleSelect"
                        value={selectedModule}
                        onChange={handleModuleChange}
                        className="module-select"
                    >
                        <option value="">--Selecciona un módulo--</option>
                        {modules && modules.map((module, index) => (
                            <option key={index} value={module}>
                                {module}
                            </option>
                        ))}
                    </select>

                    {selectedModule && (
                        <div className="button-group">
                            <button
                                onClick={handlePostRequest}
                                className="btn btn-green"
                            >
                                Obtener Json para post de datos
                            </button>
                            <button
                                onClick={handleGetLatestData}
                                className="btn btn-blue"
                            >
                                Obtener últimos datos del módulo
                            </button>
                        </div>
                    )}
                </div>

                <div className="chart-section">
                    <h2>Graficación</h2>
                    <label htmlFor="startDate">Fecha de inicio:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
 className="date-input"
                    />

                    <label htmlFor="endDate" className="date-label">Fecha de fin:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="date-input"
                    />

                    <button
                        onClick={handleGetDataByDateRange}
                        className="btn btn-orange"
                    >
                        Obtener datos por rango de fechas
                    </button>
                </div>
            </div>

            {latestData && (
                <div className="latest-data-section">
                    <h2>Datos más recientes del módulo seleccionado</h2>
                    <pre className="latest-data-pre">
                        {JSON.stringify(latestData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default DeviceView;