const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/devices.controller');

router.get('/', DeviceController.getAll);
router.post('/', DeviceController.create);
router.get('/byid/:id', DeviceController.getById);
router.put('/update/:id', DeviceController.updateById);
router.delete('/delete/:id', DeviceController.deleteById);
router.get('/names', DeviceController.getOnlyNames);

module.exports = router;
