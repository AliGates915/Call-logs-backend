import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getAssignedClients
} from '../controllers/clientController.js';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { authenticate, requireAdmin, requireStaff } from '../config/middleware.js';
const router = express.Router();

const upload = multer({ storage });

router.post('/', authenticate, requireAdmin, upload.single('companyLogo'), createClient);
router.get('/', getAllClients);
router.get('/assigned', authenticate, requireStaff, getAssignedClients);
router.get('/:id',  getClientById);
router.put('/:id', authenticate, requireAdmin, upload.single('companyLogo'), updateClient);
router.delete('/:id',authenticate, requireAdmin, deleteClient);

export default router;
