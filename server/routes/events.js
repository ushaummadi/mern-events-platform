import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import Event from '../models/Event.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// GET all upcoming events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ dateTime: { $gte: new Date() } })
      .populate('createdBy', 'name')
      .populate('attendees', 'name')
      .sort({ dateTime: 1 })
      .lean();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('attendees', 'name');
    if (!event) return res.status(404).json({ error: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE (auth)
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user.id,
    });
    await event.save();
    await event.populate('createdBy', 'name');
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!event) {
      return res
        .status(404)
        .json({ error: 'Event not found or not owner' });
    }
    Object.assign(event, req.body);
    await event.save();
    await event.populate('createdBy', 'name');
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!event) {
      return res
        .status(404)
        .json({ error: 'Event not found or not owner' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// RSVP JOIN (atomic capacity + no duplicate)
router.post('/:id/rsvp', auth, async (req, res) => {
  try {
    const result = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        attendees: { $ne: req.user.id },
        $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] },
      },
      { $addToSet: { attendees: req.user.id } },
      { new: true }
    ).populate('createdBy attendees', 'name');

    if (!result) {
      return res.status(400).json({
        error: 'Cannot join: event full or already joined',
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// RSVP LEAVE
router.delete('/:id/rsvp', auth, async (req, res) => {
  try {
    const result = await Event.findOneAndUpdate(
      { _id: req.params.id, attendees: req.user.id },
      { $pull: { attendees: req.user.id } },
      { new: true }
    ).populate('createdBy attendees', 'name');

    if (!result) {
      return res.status(404).json({ error: 'Not attending this event' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// IMAGE upload (owner only)
router.post(
  '/:id/image',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      const event = await Event.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      });
      if (!event) {
        return res
          .status(404)
          .json({ error: 'Event not found or not owner' });
      }
      if (req.file) {
        event.imageUrl = `/uploads/${req.file.filename}`;
        await event.save();
      }
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
