const express = require('express');
const router = express.Router();

const {filtersController} = require('../controllers/alerts.controller');

router.post('/create', filtersController.create);
router.post('/getbyModule', filtersController.getbyModule);
router.post('/getbyDevice', filtersController.getbyDevice);
router.patch('/update', filtersController.modify);
router.post('device-module', filtersController.getFilterbyDeviceandModule);
router.get('/getall', filtersController.getAll);

module.exports = router;