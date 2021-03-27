import express from 'express';
import { getStates, getState } from '../controllers/stateController.js';

const router = express.Router();

router.get('/', getStates);
router.get('/:id', getState);

export default router;