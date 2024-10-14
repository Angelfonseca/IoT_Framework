const fs = require('fs');
const path = require('path');

const genDataModel = (name, fields) => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].ref) {
            fields[i].type = `mongoose.Schema.Types.ObjectId`;
            fields[i].ref = `ref: '${fields[i].ref}'`;
        }

        if (fields[i].type === 'object') {
            for (let j = 0; j < fields[i].fields.length; j++) {
                if (fields[i].fields[j].ref) {
                    fields[i].fields[j].type = `mongoose.Schema.Types.ObjectId`;
                    fields[i].fields[j].ref = `ref: '${fields[i].fields[j].ref}'`;
                }
                fields[i].fields[j] = `${fields[i].fields[j].name}: { type: ${fields[i].fields[j].type}, required: ${fields[i].fields[j].required ? fields[i].fields[j].required : false} }`;
            }
            fields[i].type = `{ ${fields[i].fields.join(', ')} }`;
        }

        fields[i] = `${fields[i].name}: { type: ${fields[i].type}, required: ${fields[i].required}${fields[i].ref ? `, ${fields[i].ref}` : ''} }`;
    }

    const schemaStr = `
const mongoose = require('mongoose');
const ${name}Schema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    ${fields.join(',\n    ')}
}, { timestamps: true });

module.exports = mongoose.model('${name}', ${name}Schema);
`;
    return schemaStr;
};

const createDataModel = async (name, fields) => {
    const dirPath = path.join(__dirname, '../models/data'); // Adjust path as necessary
    const filePath = path.join(dirPath, `${name}.js`);

    // Create the directory if it does not exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const dataModel = genDataModel(name, fields);
    await saveJson(fields, name); // Ensure saveJson is awaited if you change it to be async
    fs.writeFileSync(filePath, dataModel);
};

const finalController = async (req, res) => { // Make this function async
    const { name, fields } = req.body;
    await createDataModel(name, fields); // Await the call
    res.json({ message: 'Model created successfully' });
};

const saveJson = (fields, name) => {
    const dirPath = path.join(__dirname, '../../public'); // Adjust path as necessary
    const filePath = path.join(dirPath, `${name}.json`);

    // Create the directory if it does not exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    let content = '[\n';

    fields.forEach((field, index) => {
        if (field.type === 'object') {
            content += `    "${field.name}": {\n`;
            field.fields.forEach((subField, subIndex) => {
                content += `        "${subField.name}": "${subField.type}"`;
                if (subIndex < field.fields.length - 1) {
                    content += ',\n';
                }
            });
            content += '\n    }';
        } else {
            content += `    "${field.name}": "${field.type}"`;
        }
        if (index < fields.length - 1) {
            content += ',\n';
        }
    });

    content += '\n]';
    fs.writeFileSync(filePath, content);
};

module.exports = finalController;
