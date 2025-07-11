import express from 'express';
import { check } from 'express-validator';
import { 
  getAllNetlists, 
  getNetlistById, 
  createNetlist, 
  updateNetlist, 
  deleteNetlist 
} from '../controllers/netlist';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getAllNetlists);

router.get('/:id', auth, getNetlistById);

router.post(
  '/',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('components', 'Components are required').isArray(),
    check('nets', 'Nets are required').isArray()
  ],
  createNetlist
);

router.put(
  '/:id',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('components', 'Components are required').isArray(),
    check('nets', 'Nets are required').isArray()
  ],
  updateNetlist
);

router.delete('/:id', auth, deleteNetlist);

export default router;
