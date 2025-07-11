import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Netlist, { INetlist } from '../models/Netlist';
import { validateNetlist } from '../services/netlistValidator';

export const getAllNetlists = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const netlists = await Netlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(netlists);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getNetlistById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const netlist = await Netlist.findById(req.params.id);

    if (!netlist) {
      return res.status(404).json({ msg: 'Netlist not found' });
    }

    if (netlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(netlist);
  } catch (err) {
    console.error(err);
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Netlist not found' });
    }
    res.status(500).send('Server error');
  }
};

export const createNetlist = async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, description, components, nets } = req.body;

    const validationResults = validateNetlist({ components, nets });

    const newNetlist = new Netlist({
      name,
      description,
      user: req.user.id,
      components,
      nets,
      validationResults
    });

    const netlist = await newNetlist.save();

    res.json(netlist);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const updateNetlist = async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { name, description, components, nets } = req.body;

    let netlist = await Netlist.findById(req.params.id);

    if (!netlist) {
      return res.status(404).json({ msg: 'Netlist not found' });
    }

    if (netlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const validationResults = validateNetlist({ components, nets });

    netlist = await Netlist.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        components,
        nets,
        validationResults
      },
      { new: true }
    );

    res.json(netlist);
  } catch (err) {
    console.error(err);
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Netlist not found' });
    }
    res.status(500).send('Server error');
  }
};

export const deleteNetlist = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const netlist = await Netlist.findById(req.params.id);

    if (!netlist) {
      return res.status(404).json({ msg: 'Netlist not found' });
    }

    if (netlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await netlist.deleteOne();

    res.json({ msg: 'Netlist removed' });
  } catch (err) {
    console.error(err);
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Netlist not found' });
    }
    res.status(500).send('Server error');
  }
};
