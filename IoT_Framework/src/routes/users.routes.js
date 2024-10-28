const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users.controller');

router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.updateById);
router.delete('/:id', UserController.deleteById);
router.post('/auth/login', UserController.login);

module.exports = router;
