import express from 'express';

import { getUsers, getUser, createUser, loginUser, updateUser, deleteUser } from '../controllers/userController.js';
import authentication from '../middleware/authentication.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', authentication, getUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.put('/:id', authentication, updateUser);
router.delete('/:id', authentication, deleteUser);

export default router;