import React, { useState } from "react";
import "../assets/css/viewsCss/modelosView.css";
import SchemaPreview from "../components/preView";
import apiService from "../services/api.service"; // Importa apiService

type Field = {
  name: string;
  type: string;
  required: boolean;
  fields?: Field[];
};

type Model = {
  name: string;
  fields: Field[];
};

const ModelCreator: React.FC = () => {
  const [modelName, setModelName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);

  const addField = () => {
    const newField: Field = { name: "", type: "String", required: false };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updatedField: Partial<Field>) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, ...updatedField } : field
    );
    setFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const addSubField = (fieldIndex: number) => {
    const newSubField: Field = { name: "", type: "String", required: false };
    const updatedFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        const newFields = field.fields
          ? [...field.fields, newSubField]
          : [newSubField];
        return { ...field, fields: newFields };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const updateSubField = (
    fieldIndex: number,
    subFieldIndex: number,
    updatedField: Partial<Field>
  ) => {
    const updatedFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        const updatedSubFields = field.fields!.map((subField, j) =>
          j === subFieldIndex ? { ...subField, ...updatedField } : subField
        );
        return { ...field, fields: updatedSubFields };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const removeSubField = (fieldIndex: number, subFieldIndex: number) => {
    const updatedFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        const updatedSubFields = field.fields!.filter(
          (_, j) => j !== subFieldIndex
        );
        return { ...field, fields: updatedSubFields };
      }
      return field;
    });
    setFields(updatedFields);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation: Check if the model name and fields are filled
    if (!modelName.trim()) {
      alert("El nombre del modelo es obligatorio.");
      return;
    }
    
    if (fields.some(field => !field.name.trim() || !field.type)) {
      alert("Todos los campos deben tener un nombre y un tipo.");
      return;
    }

    const model: Model = { name: modelName, fields };

    try {
      await apiService.post("/creator/create", model); // Enviar datos a tu API
      console.log("Modelo enviado exitosamente", model);
      // Reset form after successful submission
      setModelName("");
      setFields([]);
    } catch (error) {
      console.error("Error al enviar el modelo:", error);
    }
  };

  return (
    <div className="model-creator">
      <h1>Generador de Modelos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="modelName">Nombre:</label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => {
              const value = e.target.value;
              if (!/\s/.test(value) && value.length <= 15 && !/[//]/.test(value)) {
                setModelName(value);
              }
            }}
            required
          />
        </div>
        <h3>Campos</h3>
        {fields.map((field, fieldIndex) => (
          <div key={fieldIndex} className="field-container">
            <h4>Campo {fieldIndex + 1}</h4>
            <label htmlFor={`fieldName-${fieldIndex}`}>Nombre del Campo:</label>
            <input
              type="text"
              id={`fieldName-${fieldIndex}`}
              value={field.name}
              onChange={(e) =>
                updateField(fieldIndex, { name: e.target.value })
              }
              required
            />
            <label htmlFor={`fieldType-${fieldIndex}`}>Tipo:</label>
            <select
              id={`fieldType-${fieldIndex}`}
              value={field.type}
              onChange={(e) =>
                updateField(fieldIndex, { type: e.target.value })
              }
            >
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Object">Object</option>
              <option value="Boolean">Boolean</option>
              <option value="Array">Array</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  updateField(fieldIndex, { required: e.target.checked })
                }
              />
              Requerido
            </label>

            {field.type === "Object" && (
              <>
                <h5>Subcampos</h5>
                {field.fields &&
                  field.fields.map((subField, subFieldIndex) => (
                    <div key={subFieldIndex} className="subfield-container">
                      <label
                        htmlFor={`subFieldName-${fieldIndex}-${subFieldIndex}`}
                      >
                        Nombre del Subcampo:
                      </label>
                      <input
                        type="text"
                        id={`subFieldName-${fieldIndex}-${subFieldIndex}`}
                        value={subField.name}
                        onChange={(e) =>
                          updateSubField(fieldIndex, subFieldIndex, {
                            name: e.target.value,
                          })
                        }
                        required
                      />
                      <label
                        htmlFor={`subFieldType-${fieldIndex}-${subFieldIndex}`}
                      >
                        Tipo:
                      </label>
                      <select
                        id={`subFieldType-${fieldIndex}-${subFieldIndex}`}
                        value={subField.type}
                        onChange={(e) =>
                          updateSubField(fieldIndex, subFieldIndex, {
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="String">String</option>
                        <option value="Number">Number</option>
                        <option value="Object">Object</option>
                        <option value="Boolean">Boolean</option>
                        <option value="Array">Array</option>
                      </select>
                      <label>
                        <input
                          type="checkbox"
                          checked={subField.required}
                          onChange={(e) =>
                            updateSubField(fieldIndex, subFieldIndex, {
                              required: e.target.checked,
                            })
                          }
                        />
                        Requerido
                      </label>
                      <button
                        className="btn-dlt"
                        type="button"
                        onClick={() =>
                          removeSubField(fieldIndex, subFieldIndex)
                        }
                      >
                        Eliminar Subcampo
                      </button>
                    </div>
                  ))}
                <button className="btn-add" type="button" onClick={() => addSubField(fieldIndex)}>
                  Agregar Subcampo
                </button>
              </>
            )}
            <button className="btn-dlt" type="button" onClick={() => removeField(fieldIndex)}>
              Eliminar Campo
            </button>
          </div>
        ))}
        <button className="btn-add" type="button" onClick={addField}>
          Agregar Campo
        </button>
        <button className="btn-gen" type="submit">Generar Modelo</button>
      </form>

      {/* Vista previa del modelo */}
      <h3>Vista Previa del Modelo</h3>
      <SchemaPreview modelName={modelName} fields={fields} />
    </div>
  );
};

export default ModelCreator;
