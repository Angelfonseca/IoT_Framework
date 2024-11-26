const express = require('express');
const router = express.Router();

const {AlertsController} = require('../controllers/alerts.controller');

router.post('/getbyModule', AlertsController.getbyModule);
router.post('/getNotSeen', AlertsController.getNotSeen);
router.patch('/addSeen', AlertsController.addSeen);
router.patch('/addResolved/:id', AlertsController.addResolved);
router.post('/getbyDevice', AlertsController.getbyDevice);
router.get('/getall', AlertsController.getAll);
router.get('/notresolved', AlertsController.getNotResolved);

module.exports = router;
