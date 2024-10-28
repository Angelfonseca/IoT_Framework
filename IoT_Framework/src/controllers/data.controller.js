const {modules, listModules} = require('../models/data/index');
const fs = require('fs');
const path = require('path');
const DataController = {
    fetchModules: async (req, res) => {
        try {
            const moduleList = listModules(); 
            console.log(moduleList); 
            res.json( moduleList); 
        } catch (error) {
            console.error(error); 
            res.status(500).json({ error: 'Failed to fetch modules' }); 
        }
    },
    listModules: async (req, res) => {
        try {
            const modulesList = listModules(); 
            res.json(modulesList); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch modules' });
        }
    },

    getAll: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const data = await model.find();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },

    create: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const data = req.body.data; // Cambiado a req.body.data
            if (!data) {
                return res.status(400).json({ error: 'No data provided' });
            }
            const newData = new model(data);
            await newData.save();
            res.status(201).json(newData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create data' });
        }
    },

    getById: async (req, res) => {
        try {
            const moduleName = req.params.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const id = req.params.id;
            const data = await model.findById(id);
            if (!data) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },
    getModulesbyDevice: async (req, res) => {
        try {
            const modulesList = listModules(); // Llama a la función que lista los módulos
            for (const module of modulesList) {
                const model = modules[module];
                if (!model) {
                    return res.status(400).json({ error: 'Invalid module name' });
                }
                const id = req.params.id;
                const data = await model.find({ device: id });
                if (!data) {
                    return res.status(404).json({ error: 'Data not found' });
                }
                res.json(data);
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }

    }
    ,

    updateById: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const id = req.params.id;
            const data = req.body;
            const updatedData = await model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedData) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.json({ message: 'Updated', updatedData });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update data' });
        }
    },

    deleteById: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const id = req.params.id;
            const deletedData = await model.findByIdAndDelete(id);
            if (!deletedData) {
                return res.status(404).json({ error: 'Data not found' });
            }
            res.json({ message: 'Deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete data' });
        }
    },

    getDataByDateRange: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const { id } = req.params;
            const { startDate, endDate } = req.body;
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Invalid date range' });
            }
            const data = await model.find({ device: id, createdAt: { $gte: startDate, $lte: endDate } });
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data by date range' });
        }
    },

    convertJson: async (req, res) => {
        const deviceId = req.params.id;
        const jsonName = req.body.json;
    
        // Verificar que el nombre del archivo JSON fue proporcionado
        if (!jsonName) {
            return res.status(400).json({ error: 'No JSON name provided' });
        }
    
        // Construir la ruta completa del archivo JSON
        const jsonFilePath = path.join(__dirname, '../../public/', `${jsonName}.json`);
    
        // Verificar que el archivo existe
        if (!fs.existsSync(jsonFilePath)) {
            return res.status(400).json({ error: 'JSON file not found' });
        }
    
        try {
            // Leer y parsear el archivo JSON
            const dataJson = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
            if (!dataJson || typeof dataJson !== 'object') {
                return res.status(400).json({ error: 'Invalid JSON format or no data provided' });
            }
    
            if (!deviceId) {
                return res.status(400).json({ error: 'No device id provided' });
            }
    
            // Añadir el ID del dispositivo al JSON
            dataJson.device = deviceId.toString();
    
            console.log(dataJson);
            return res.json(dataJson);
    
        } catch (error) {
            console.error('Error processing JSON:', error);
            return res.status(500).json({ error: 'Failed to process JSON' });
        }
    },

    getMostRecentData: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            if (!moduleName) {
                return res.status(400).json({ error: 'No module name provided' });
            }
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const id = req.params.id;
            const data = await model.find({ device: id }).sort({ createdAt: -1 }).limit(1);
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'No recent data found' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch most recent data' });
        }
    },
};

module.exports = DataController;