const express = require('express');
const router = express.Router();
const DataController = require('../controllers/data.controller');

router.get('/', DataController.getAll);
router.post('/', DataController.create);
router.get('/:id', DataController.getById);
router.put('/:id', DataController.updateById);
router.delete('/:id', DataController.deleteById);
router.post('/range/:id', DataController.getDataByDateRange);
router.get('/latest/:id', DataController.getMostRecentData);
module.exports = router;
