import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactJson from "react-json-view";
import apiService from "../services/api.service";
import "../assets/css/viewsCss/deviceView.css";

interface Modules {
  modules: ModuleData[];
}

interface ModuleData {
  name: string;
  _id: string;
}

const DeviceView: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate(); // hook para redirección
  const [generalModules, setGeneralModules] = useState<Modules[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [jsonResponse, setJsonResponse] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await apiService.get<Modules>("/modules");
        console.log("General Modules:", response);
        if (response.modules.length === 0) return;
        setGeneralModules(response.modules);
      } catch (error) {
        console.error("Error fetching general modules:", error);
      }
    };
    fetchModules();
  }, []);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModule(e.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const requestBody = { module: selectedModule };
      const response = await apiService.post(`/data/json/${id}`, requestBody);
      setJsonResponse({data: response});
      alert("Request successfully sent");
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  const handleRedirectToGraphs = () => {
    // Redirige a la página de gráficos con el id
    navigate(`/graficas/${id}`);
  };

  return (
    <div className="device-view-container">
      <h1>Device ID: {id}</h1>
      <div className="layout">
        <div className="module-section">
          <h2>Generar JSON para POST</h2>
          <div className="json-display">
            {jsonResponse ? (
              <ReactJson src={jsonResponse} theme="monokai" collapsed={false} />
            ) : (
              <p>No se ha hecho ninguna petición aún.</p>
            )}
          </div>
          <label htmlFor="moduleSelect">Selecciona un módulo:</label>
          <select
            id="moduleSelect"
            value={selectedModule}
            onChange={handleModuleChange}
            className="module-select"
          >
            <option value="">--Selecciona un módulo--</option>
            {generalModules.length > 0 ? (
              generalModules.map((module, index) => (
                <option key={index} value={module._id}>
                  {module.name}
                </option>
              ))
            ) : (
              <option value="">Cargando módulos...</option>
            )}
          </select>
          {selectedModule && (
            <div className="button-group">
              <button onClick={handlePostRequest} className="btn btn-green">
                Obtener Json para post de datos
              </button>
            </div>
          )}
        </div>
        <div className="chart-section">
          <button onClick={handleRedirectToGraphs} className="btn btn-orange">
            Ir a Gráficas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceView;
