const Device = require('../models/device.model');

const DeviceController = {
    getAll: async (req, res) => {
        try {
            const data = await Device.find();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch devices' });
        }
    },

    create: async (req, res) => {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ error: 'No device data provided' });
            }
            const newDevice = new Device(data);
            await newDevice.save();
            res.status(201).json(newDevice);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create device' });
        }
    },

    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const data = await Device.findById(id);
            if (!data) {
                return res.status(404).json({ error: 'Device not found' });
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch device' });
        }
    },

    updateById: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const updatedDevice = await Device.findByIdAndUpdate(id, data, { new: true });
            if (!updatedDevice) {
                return res.status(404).json({ error: 'Device not found' });
            }
            res.json({ message: 'Updated', updatedDevice });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update device' });
        }
    },

    deleteById: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedDevice = await Device.findByIdAndDelete(id);
            if (!deletedDevice) {
                return res.status(404).json({ error: 'Device not found' });
            }
            res.json({ message: 'Deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete device' });
        }
    },
};

module.exports = DeviceController;
