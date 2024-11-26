const {modules, listModules} = require('../models/data/index');
const fs = require('fs');
const path = require('path');
const {compare} = require('./alerts.controller')
const ModulesModel = require('../models/modules.model');
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
            const moduleId = req.body.data.module;
            const module = await ModulesModel.findById(moduleId.toString());
            const moduleName = module.name;
            const model = modules[moduleName];
            
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
    
            const data = req.body.data;
            
            if (!data) {
                return res.status(400).json({ error: 'No data provided' });
            }
            const compareResults = await compare(data, req.body.data.device, moduleId);
            if (compareResults && compareResults.length > 0) {
                console.log("Alerts generated:", compareResults);
            }
            const newData = new model(data);
            await newData.save();
    
            res.status(201).json(newData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create data', details: error.message });
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
            const moduleId = req.body.module;
            const module = await ModulesModel.findById(moduleId);
            const moduleName = module.name;
            const model = modules[moduleName];
            const { startDate, endDate, filters } = req.body;
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
    
            const id = req.params.id;
            
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Invalid date range' });
            }
            console.log (startDate, endDate);
            const data = await model.find({ device: id, createdAt: { $gte: startDate, $lte: endDate } });
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'No data found for the specified range' });
            }
            if (!filters || filters.length === 0) {
                return res.status(400).json({ error: 'Filters are required to process the data' });
            }
            
    
            const selectedData = data.map(entry => {
                const values = [];
    
                filters.forEach(filter => {
                    const keys = filter.split('.'); 
    
                    if (keys.length > 1) { 
                        const mainKey = keys[0];
                        const nestedKey = keys[1];
    
                        if (Array.isArray(entry[mainKey])) {
                            entry[mainKey].forEach(nestedObject => {
                                if (nestedObject[nestedKey] !== undefined) {
                                    values.push({
                                        name: filter,
                                        value: nestedObject[nestedKey]
                                    });
                                }
                            });
                        } else if (entry[mainKey] && entry[mainKey][nestedKey] !== undefined) {
                            values.push({
                                name: filter,
                                value: entry[mainKey][nestedKey]
                            });
                        }
                    } else { 
                        if (entry[filter] !== undefined) {
                            values.push({
                                name: filter,
                                value: entry[filter]
                            });
                        }
                    }
                });
    
                return {
                    date: entry.createdAt,
                    values: values
                };
            });
    
            const filteredSelectedData = selectedData.filter(item => item.values.length > 0);
            res.json(filteredSelectedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
            res.status(500).json({ error: 'Failed to fetch data by date range' });
        }
    },
    
  

    convertJson: async (req, res) => {
        const deviceId = req.params.id;
        const moduleId = req.body.module;
        const module = await ModulesModel.findById(moduleId);
        const jsonName = module.name;

    
        if (!jsonName) {
            return res.status(400).json({ error: 'No JSON name provided' });
        }
    
        const jsonFilePath = path.join(__dirname, '../../public/', `${jsonName}.json`);
    
        if (!fs.existsSync(jsonFilePath)) {
            return res.status(400).json({ error: 'JSON file not found' });
        }
    
        try {
            const dataJson = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
            if (!dataJson || typeof dataJson !== 'object') {
                return res.status(400).json({ error: 'Invalid JSON format or no data provided' });
            }
    
            if (!deviceId) {
                return res.status(400).json({ error: 'No device id provided' });
            }
            dataJson.device = deviceId.toString();
            dataJson.module = moduleId.toString();
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
    getModulesIncludesDevice: async (req, res) => {
        const deviceId = req.params.id;
        const modulesList = await ModulesModel.find();
        const foundModules = new Set();
    
        try {
            for (const module of modulesList) {
                const model = modules[module.name];
                if (!model) {
                    return res.status(400).json({ error: 'Invalid module name' });
                }
    
                const data = await model.find({ device: deviceId });
                if (data && data.length > 0) {
                    foundModules.add(module);
                }
            }
    
            if (foundModules.size > 0) {
                return res.json({ modules: Array.from(foundModules) });
            } else {
                return res.status(404).json({ error: 'No modules found with the specified device' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
    },
    getAvailableDataToGraphic: async (req, res) => {
        try {
            const moduleId = req.body.module; 
            const modelName = await ModulesModel.findById(moduleId);
            if (!modelName) {
                return res.status(400).json({ error: 'Invalid module ID' });
            }
            const model = modules[modelName.name];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const id = req.params.id;
            const data = await model.find({ device: id });
            if (!data || data.length === 0) {
                return res.status(404).json({ error: 'Data not found' });
            }
            const graphableAttributes = getGraphableAttributes(data);
    
            res.json({ graphableAttributes });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    }
    
};
const getGraphableAttributes = (jsonData) => {
    const graphableAttributes = new Set();

    const extractAttributes = (obj, prefix = '') => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const fullKey = prefix ? `${prefix}.${key}` : key;

                if (typeof value === 'number') {
                    graphableAttributes.add(fullKey);
                } else if (typeof value === 'object' && value !== null) {
                    extractAttributes(value, fullKey);
                }
            }
        }
    };

    jsonData.forEach(dataEntry => {
        if (dataEntry.Sensores && Array.isArray(dataEntry.Sensores)) {
            dataEntry.Sensores.forEach(sensor => extractAttributes(sensor, 'Sensores'));
        }
    });

    return Array.from(graphableAttributes);
};

module.exports = DataController;