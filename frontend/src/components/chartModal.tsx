import React, { useEffect, useState } from "react";
import apiService from "../services/api.service";
import Chart from "../components/graficas"; // Importa el componente de Chart
import "../assets/css/componentsCss/chartModal.css";
import html2canvas from "html2canvas";

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

interface DataPoint {
  date: string;
  values: { name: string; value: number }[];
}

interface DataPoints {
  data: DataPoint[];
}

interface GraphConfig {
  module: string;
  chartType: "bar" | "line" | "scatter";
  selectedFields: string[];
  chartData: DataPoint[];
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, id }) => {
  const [modules, setModules] = useState<string[]>([]);
  const [selectedGraphModule, setSelectedGraphModule] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [chartType, setChartType] = useState<"bar" | "line" | "scatter">(
    "line"
  );
  const [fields, setFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [graphs, setGraphs] = useState<GraphConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ modules: string[] }>(
          `/data/from-device/${id}`
        );
        setModules(response.modules || []);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();

    const today = new Date();
    const endDate = today.toISOString().split("T")[0];
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    setDateRange({
      startDate: startDate.toISOString().split("T")[0],
      endDate,
    });
  }, [id]);

  useEffect(() => {
    const fetchFields = async () => {
      if (!selectedGraphModule) return;
      try {
        const response = await apiService.post<{ fields: string[] }>(
          `/data/to-graph/${id}`,
          {
            module: selectedGraphModule,
          }
        );
        setFields(response.graphableAttributes || []); // Asegúrate de acceder a la propiedad correcta
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };
    fetchFields();
  }, [selectedGraphModule, id]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedFields((prev) =>
      checked ? [...prev, value] : prev.filter((field) => field !== value)
    );
  };

  const handleAddGraph = async () => {
    if (
      !selectedGraphModule ||
      !dateRange.startDate ||
      !dateRange.endDate ||
      selectedFields.length === 0
    )
      return;

    try {
      const response = await apiService.post<{ data: DataPoints[] }>(
        `data/range/${id}`,
        {
          module: selectedGraphModule,
          startDate: new Date(dateRange.startDate).toISOString(),
          endDate: new Date(dateRange.endDate).toISOString(),
          filters: selectedFields,
        }
      );
      const newGraphConfig: GraphConfig = {
        module: selectedGraphModule,
        chartType,
        selectedFields,
        chartData: response,
      };
      console.log("New graph config:", newGraphConfig);
      setGraphs((prev) => [...prev, newGraphConfig]);
    } catch (error) {
      console.error("Error fetching data by date range:", error);
    }
  };

  const handleRemoveGraph = (index: number) => {
    setGraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadGraph = async (
    graphConfig: GraphConfig,
    index: number,
    format: "png"
  ) => {
    setIsDownloading(true);
    const chartElement = document.querySelector(`#chart-${index}`);
    if (!chartElement) {
      console.error("No se encontró el gráfico para descargar.");
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(chartElement as HTMLElement);
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = `${graphConfig.module}_chart.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error al convertir el gráfico a PNG:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`chart-modal ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <div className="chart-modal-content">
          <button onClick={onClose} className="close-button">
            Cerrar
          </button>
          <h2>Graficación y Datos por Rango de Fechas</h2>
          {loading ? (
            <p>Cargando módulos...</p>
          ) : (
            <>
              <label htmlFor="graphModuleSelect">
                Selecciona un módulo para graficar:
              </label>
              <select
                id="graphModuleSelect"
                value={selectedGraphModule}
                onChange={(e) => setSelectedGraphModule(e.target.value)}
                className="module-select"
              >
                <option value="">--Selecciona un módulo--</option>
                {modules.map((module, index) => (
                  <option key={index} value={module}>
                    {module}
                  </option>
                ))}
              </select>
              <label htmlFor="chartType">Selecciona tipo de gráfica:</label>
              <select
                id="chartType"
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "bar" | "line" | "scatter")
                }
                className="chart-type-select"
              >
                <option value="line">Línea</option>
                <option value="bar">Barra</option>
                <option value="scatter">Puntos</option>
              </select>
              {selectedGraphModule && (
                <>
                  <div>
                    <label htmlFor="startDate">Fecha de inicio:</label>
                    <input
                      type="date"
                      id="startDate"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange({
                          ...dateRange,
                          startDate: e.target.value,
                        })
                      }
                      className="date-input"
                    />
                    <label htmlFor="endDate" className="date-label">
                      Fecha de fin:
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={dateRange.endDate}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, endDate: e.target.value })
                      }
                      className="date-input"
                    />
                    <button onClick={handleAddGraph} className="btn btn-orange">
                      Agregar Gráfica
                    </button>
                  </div>
                  <div>
                    <h3>Selecciona campos a graficar:</h3>
                    {fields.length > 0 ? (
                      fields.map((field, index) => (
                        <div className="selector" key={index}>
                          <input
                            type="checkbox"
                            id={field}
                            value={field}
                            onChange={handleFieldChange}
                          />
                          <label htmlFor={field}>{field}</label>
                        </div>
                      ))
                    ) : (
                      <p>Cargando campos...</p>
                    )}
                  </div>
                </>
              )}
              {graphs.length > 0 && (
                <div className="chart-container">
                  {graphs.map((graphConfig, index) => (
                    <div
                      key={index}
                      className="chart-item"
                      id={`chart-${index}`}
                    >
                      <h3>{`Módulo: ${graphConfig.module}`}</h3>
                      <p>{`Rango de fechas: ${dateRange.startDate} - ${dateRange.endDate}`}</p>
                      <Chart
                      title={`Gráfica de ${graphConfig.module}`}
                      datos={graphConfig.chartData}
                      chartType={graphConfig.chartType}
                      selectedFields={graphConfig.selectedFields}
                      fullScreen={false}
                      />
                      <button
                      onClick={() => handleRemoveGraph(index)}
                      className="btn btn-red"
                      disabled={isDownloading}
                      >
                      Quitar Gráfica
                      </button>
                      <button
                      onClick={() =>
                        handleDownloadGraph(graphConfig, index, "png")
                      }
                      className="btn btn-green"
                      disabled={isDownloading}
                      >
                      Descargar PNG
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartModal;
