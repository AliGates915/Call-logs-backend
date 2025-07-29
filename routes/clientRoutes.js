import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';

import { requireAdmin } from '../config/middleware.js';
const router = express.Router();

router.post('/', requireAdmin, createClient);
router.get('/', getAllClients);
router.get('/:id', requireAdmin, getClientById);
router.put('/:id', requireAdmin, updateClient);
router.delete('/:id', requireAdmin, deleteClient);

export default router;
