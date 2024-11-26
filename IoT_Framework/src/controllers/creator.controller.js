const fs = require('fs');
const path = require('path');
const ModeloSchema = require('../models/modules.model');

// Función para generar el esquema de datos
const genDataModel = (name, fields) => {
    const schemaFields = fields.map(field => {
        if (field.ref) {
            field.type = 'mongoose.Schema.Types.ObjectId';
        }

        if (field.type === 'Object' && field.fields) {
            // Procesar campos anidados en el objeto sin crear un nuevo esquema
            const subFields = field.fields.map(subField => {
                if (subField.ref) {
                    subField.type = 'mongoose.Schema.Types.ObjectId';
                }
                return `${subField.name}: { type: ${subField.type}, required: ${subField.required || false} }`;
            });
            // Aquí solo se define como un objeto sin crear un subesquema
            return `${field.name}: { type: Object, properties: { ${subFields.join(', ')} } }`;
        } else {
            return `${field.name}: { type: ${field.type}, required: ${field.required || false}${field.ref ? `, ref: '${field.ref}'` : ''} }`;
        }
    });

    // Verificar si 'device' ya está en los campos
    const hasDeviceField = fields.some(field => field.name === 'device');
    const hasModuleField = fields.some(field => field.name === 'module');

    // Solo agregar el campo 'device' si no existe ya
    if (!hasDeviceField) {
        schemaFields.unshift(`device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true }`);
    }
    else if (!hasModuleField) {
        schemaFields.unshift(`module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true }`);
    }

    const schemaStr = `
const mongoose = require('mongoose');
const ${name}Schema = new mongoose.Schema({
    ${schemaFields.join(',\n    ')}
}, { timestamps: true });

module.exports = mongoose.model('${name}', ${name}Schema);
`;

    return schemaStr;
};

// Función para crear el archivo del modelo de datos
const createDataModel = async (name, fields) => {
    const dirPath = path.join(__dirname, '../models/data'); // Ajustar la ruta según sea necesario
    const filePath = path.join(dirPath, `${name}.js`);
    await ModeloSchema.create({name: name});
    // Crear el directorio si no existe
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const dataModel = genDataModel(name, fields);
    await saveJson(fields, name); // Asegurarse de que saveJson sea asíncrona si cambias esto
    fs.writeFileSync(filePath, dataModel);
};

// Controlador final para manejar la creación del modelo
const finalController = async (req, res) => {
    const { name, fields } = req.body;
    console.log(name, fields); // Esto te ayudará a verificar si los datos se están recibiendo correctamente

    try {
        await createDataModel(name, fields); // Esperar la llamada
        res.json({ message: 'Modelo creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el modelo:', error);
        res.status(500).json({ message: 'Error al crear el modelo' });
    }
};


// Función para guardar los campos en un archivo JSON
const saveJson = (fields, name) => {
    const dirPath = path.join(__dirname, '../../public'); // Ajustar la ruta según sea necesario
    const filePath = path.join(dirPath, `${name}.json`);

    // Crear el directorio si no existe
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Función para generar el contenido JSON de manera recursiva
    const generateFieldJson = (fields) => {
        const jsonContent = {};
        fields.forEach(field => {
            if (field.type === 'Object' && field.fields) {
                // Manejar campos anidados
                jsonContent[field.name] = generateFieldJson(field.fields);
                
            } else {
                jsonContent[field.name] = field.type;
            }
        });

        return jsonContent;
    };

    const content = JSON.stringify(generateFieldJson(fields), null, 4); // Convertir a JSON con formato

    fs.writeFileSync(filePath, content);
};


module.exports = finalController;
