import express from 'express';

import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.get('/:usuario', authentication, getTasks);
router.get('/t/:id/:idUsuario', authentication, getTask);
router.post('/', authentication, createTask);
router.put('/:id/:idUsuario', authentication, updateTask);
router.delete('/:id/:idUsuario', authentication, deleteTask);

export default router;