const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/devices.controller');

router.get('/', DeviceController.getAll);
router.post('/', DeviceController.create);
router.get('/:id', DeviceController.getById);
router.put('/:id', DeviceController.updateById);
router.delete('/:id', DeviceController.deleteById);

module.exports = router;
