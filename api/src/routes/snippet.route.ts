import { Router } from 'express';
import snippetController from '../controllers/snippet.controller';

const router = Router();

router.post('/', (req, res) => snippetController.create(req, res));
router.get('/:id', (req, res) => snippetController.getById(req, res));
router.put('/:id', (req, res) => snippetController.update(req, res));

export default router;
