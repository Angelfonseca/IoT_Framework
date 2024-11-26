const ModuleController = require('../controllers/modules.controller');

const router = require('express').Router();

router.get('/', ModuleController.getAll);
router.get('/:id', ModuleController.getbyId);
router.get('/name/:name', ModuleController.getByName);
router.delete('/:id', ModuleController.delete);
router.post('/graphable/:id', ModuleController.getModelsbyIdandGraphable);

module.exports = router;