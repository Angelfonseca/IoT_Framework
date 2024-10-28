const express = require('express');
const router = express.Router();
const DataController = require('../controllers/data.controller');

router.post('/all/', DataController.getAll);
router.post('/create/', DataController.create);
router.get('/data/:id', DataController.getById);
router.put('/:id', DataController.updateById);
router.delete('/:id', DataController.deleteById);
router.post('/range/:id', DataController.getDataByDateRange);
router.post('/latest/:id', DataController.getMostRecentData);
router.get('/modules', DataController.listModules);
router.post('/json/:id', DataController.convertJson);
router.get('/allfromdevice/:id', DataController.getModulesbyDevice);

module.exports = router;
