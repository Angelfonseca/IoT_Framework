const modules = require('../models/data/index');


const DataController = {
    getAll: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            if (!model) {
                return res.status(400).json({ error: 'Invalid module name' });
            }
            const data = await model.find()
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    },

    create: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
            const data = req.data;
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

    updateById: async (req, res) => {
        try {
            const moduleName = req.body.module; 
            const model = modules[moduleName];
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
        const dataJson = require(`../../public/${jsonName}`);
        if (!dataJson.length) {
            return res.status(400).json({ error: 'No data provided' });
        }
        if (!deviceId) {
            return res.status(400).json({ error: 'No device id provided' });
        }
        try {
            const result = {
                device: deviceId,
                sensors: dataJson
            };
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to convert JSON' });
        }
    },

    getMostRecentData: async (req, res) => {
        try {
            const moduleName = req.params.module; 
            const model = modules[moduleName];
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
