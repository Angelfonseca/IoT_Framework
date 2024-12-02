const fs = require('fs');
const path = require('path');
const ModeloSchema = require('../models/modules.model');

const genDataModel = (name, fields) => {
    const schemaFields = fields.map(field => {
        if (field.ref) {
            field.type = 'mongoose.Schema.Types.ObjectId';
        }

        if (field.type === 'Object' && field.fields) {
            const subFields = field.fields.map(subField => {
                if (subField.ref) {
                    subField.type = 'mongoose.Schema.Types.ObjectId';
                }
                return `${subField.name}: { type: ${subField.type}, required: ${subField.required || false} }`;
            });
            return `${field.name}: { type: Object, properties: { ${subFields.join(', ')} } }`;
        } else {
            return `${field.name}: { type: ${field.type}, required: ${field.required || false}${field.ref ? `, ref: '${field.ref}'` : ''} }`;
        }
    });

    const hasDeviceField = fields.some(field => field.name === 'device');
    const hasModuleField = fields.some(field => field.name === 'module');

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

const createDataModel = async (name, fields) => {
    const dirPath = path.join(__dirname, '../models/data');
    const filePath = path.join(dirPath, `${name}.js`);
    await ModeloSchema.create({name: name});
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const dataModel = genDataModel(name, fields);
    await saveJson(fields, name);
    fs.writeFileSync(filePath, dataModel);
};

const finalController = async (req, res) => {
    const { name, fields } = req.body;
    try {
        await createDataModel(name, fields);
        res.json({ message: 'Modelo creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el modelo:', error);
        res.status(500).json({ message: 'Error al crear el modelo' });
    }
};


const saveJson = (fields, name) => {
    const dirPath = path.join(__dirname, '../../public'); 
    const filePath = path.join(dirPath, `${name}.json`);

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const generateFieldJson = (fields) => {
        const jsonContent = {};
        fields.forEach(field => {
            if (field.type === 'Object' && field.fields) {
                jsonContent[field.name] = generateFieldJson(field.fields);
                
            } else {
                jsonContent[field.name] = field.type;
            }
        });

        return jsonContent;
    };

    const content = JSON.stringify(generateFieldJson(fields), null, 4); 

    fs.writeFileSync(filePath, content);
};


module.exports = finalController;
