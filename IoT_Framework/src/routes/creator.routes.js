const finalController = require('../controllers/creator.controller');
const express = require('express');
const router = express.Router();

router.post('/create', finalController);

module.exports = router;
