import React, { useState, useEffect } from "react";
import apiService from "../services/api.service";
import { Filter, Condition } from "../types";
import "../assets/css/componentsCss/filterCreate.css";

interface Module {
  _id: string;
  name: string;
}


const FilterForm: React.FC = () => {
  const [filter, setFilter] = useState<Filter>({
    field: "",
    conditions: [],
    device: "",
    module: "",
  });
  const [condition, setCondition] = useState<Condition>({
    condition: "<",
    threshold: 0,
  });
  const [devices, setDevices] = useState<{ _id: string; name: string }[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [fields, setFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await apiService.get<{ _id: string; name: string }[]>("/devices");
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilter((prev) => ({ ...prev, device: value }));
    try {
      const modulesData = await apiService.get<Module[]>(`/data/from-device/${value}`);
      console.log("Modules Data:", modulesData); // Verifica los datos recibidos
      setModules(modulesData.modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setModules([]); // Asegúrate de que modules es un array
    }
  };

  const handleModuleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFilter((prev) => ({ ...prev, module: value }));
    try {
      const fieldsData = await apiService.post<string[]>(`/data/to-graph/${filter.device}`, { module: value });
      console.log("Fields Data:", fieldsData); // Verifica los datos recibidos
      setFields(fieldsData.graphableAttributes);
    } catch (error) {
      console.error("Error fetching fields:", error);
      setFields([]); // Asegúrate de que fields es un array
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCondition((prev) => ({
      ...prev,
      [name]: name === "threshold" ? parseFloat(value) : (value as Condition["condition"]),
    }));
  };

  const addCondition = () => {
    setFilter((prev) => ({
      ...prev,
      conditions: [...prev.conditions, condition],
    }));
    setCondition({ condition: "<", threshold: 0 });
  };

  const removeCondition = (index: number) => {
    setFilter((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      await apiService.post("/filters/create", filter);
      setFilter({ field: "", conditions: [], device: "", module: "" });
    } catch (error) {
      console.error("Error creating filter:", error);
    }
  };

  return (
    <div className="filter-form">
      <h3>Crear Filtro</h3>
      <div className="filter-group">
        <select name="device" value={filter.device} onChange={handleDeviceChange}>
          <option value="">Selecciona un dispositivo</option>
          {devices.map((device) => (
            <option key={device._id} value={device._id}>
              {device.name}
            </option>
          ))}
        </select>
        <select name="module" value={filter.module} onChange={handleModuleChange}>
          <option value="">Selecciona un módulo</option>
          {modules.map((module, index) => (
            <option key={index} value={module._id}>
              {module.name}
            </option>
          ))}
        </select>
        <select name="field" value={filter.field} onChange={handleInputChange}>
          <option value="">Selecciona un campo</option>
          {fields.map((field, index) => (
            <option key={index} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div className="condition-group">
        <select name="condition" value={condition.condition} onChange={handleConditionChange}>
          <option value="<">{"<"}</option>
          <option value="<=">{"<="}</option>
          <option value="=">{"="}</option>
          <option value=">=">{">="}</option>
          <option value=">">{">"}</option>
        </select>
        <input
          name="threshold"
          type="number"
          value={condition.threshold}
          onChange={handleConditionChange}
          placeholder="Threshold"
        />
        <button type="button" onClick={addCondition}>
          Add Condition
        </button>
      </div>

      <div className="conditions-list">
        <h4>Condiciones:</h4>
        {filter.conditions.map((cond, index) => (
          <div key={index} className="condition-item-wrapper">
            <div className="condition-item">
              <span>
                {cond.condition} {cond.threshold}
              </span>
            </div>
            <button className="rmv-condition" onClick={() => removeCondition(index)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={handleSubmit}>
        Crear Filtro
      </button>
    </div>
  );
};

export default FilterForm;
