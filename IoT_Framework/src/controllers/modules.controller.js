const { get } = require('mongoose');
const ModuleSchema = require('../models/modules.model');
const {modules, listModules} = require('../models/data/index');
const { create } = require('../models/user.model');

const ModulesController = {
    getbyId: async (req, res) => {
        try {
            const modelo = await ModuleSchema.findById(req.params.id);
            res.json(modelo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAll: async (_, res) => {
        try {
            const modelos = await ModuleSchema.find();
            res.json({ modules: modelos });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getByName: async (req, res) => {
        try {
            const modelo = await ModuleSchema.findOne({name: req.params.name});
            res.json(modelo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            await ModuleSchema.findByIdAndDelete(req.params.id);
            res.json({ message: 'Modelo eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getModelsbyIdandGraphable: async (req, res) => {
        try {
            const module = await ModuleSchema.findById(req.body.module);
            const moduleName = module.name;
            const modelo = modules[moduleName];
            const data = await modelo.findOne({ device: req.params.id }).sort({ createdAt: -1 });

            if (!data) {
                return res.status(404).json({ message: 'No se encontraron datos' });
            }
            const graphableAttributes = getGraphableAttributes([data]);
            res.json({ graphableAttributes });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
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
        if (dataEntry.Sensores && typeof dataEntry.Sensores === 'object') {
            extractAttributes(dataEntry.Sensores, 'Sensores');
        }
    });

    return Array.from(graphableAttributes);
};
module.exports = ModulesController;