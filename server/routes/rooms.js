import express from 'express';
import { body, validationResult } from 'express-validator';
import Room from '../models/Room.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rooms = await Room.find({
      'members.userId': req.user._id
    })
    .populate('ownerId', 'fullName email')
    .populate('members.userId', 'fullName email')
    .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate('ownerId', 'fullName email')
      .populate('members.userId', 'fullName email');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is member
    const isMember = room.members.some(member => 
      member.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create room
router.post('/', [
  authenticateToken,
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPublic = false } = req.body;

    // Generate unique invite code
    let inviteCode;
    let isUnique = false;
    
    while (!isUnique) {
      inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingRoom = await Room.findOne({ inviteCode });
      if (!existingRoom) {
        isUnique = true;
      }
    }

    const room = new Room({
      name,
      description,
      ownerId: req.user._id,
      inviteCode,
      isPublic,
      members: [{
        userId: req.user._id,
        role: 'owner'
      }]
    });

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('ownerId', 'fullName email')
      .populate('members.userId', 'fullName email');

    res.status(201).json({
      message: 'Room created successfully',
      room: populatedRoom
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join room by invite code
router.post('/join', [
  authenticateToken,
  body('inviteCode').trim().isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { inviteCode } = req.body;

    const room = await Room.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!room) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Check if user is already a member
    const isMember = room.members.some(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'You are already a member of this room' });
    }

    // Add user to room
    room.members.push({
      userId: req.user._id,
      role: 'member'
    });

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('ownerId', 'fullName email')
      .populate('members.userId', 'fullName email');

    res.json({
      message: 'Joined room successfully',
      room: populatedRoom
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave room
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is member
    const memberIndex = room.members.findIndex(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({ message: 'You are not a member of this room' });
    }

    // Owner cannot leave room (must transfer ownership or delete room)
    if (room.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Room owner cannot leave. Transfer ownership or delete the room.' });
    }

    // Remove user from room
    room.members.splice(memberIndex, 1);
    await room.save();

    res.json({ message: 'Left room successfully' });
  } catch (error) {
    console.error('Leave room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room
router.put('/:id', [
  authenticateToken,
  body('name').trim().isLength({ min: 1 }).optional(),
  body('description').trim().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is owner or admin
    const member = room.members.find(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updates, { new: true })
      .populate('ownerId', 'fullName email')
      .populate('members.userId', 'fullName email');

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete room
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only owner can delete room
    if (room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only room owner can delete the room' });
    }

    // Delete all tasks in the room
    await Task.deleteMany({ roomId: id });

    // Delete the room
    await Room.findByIdAndDelete(id);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user is member
    const isMember = room.members.some(member => 
      member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Task.aggregate([
      { $match: { roomId: room._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0
    };

    res.json({ 
      stats: result,
      memberCount: room.members.length
    });
  } catch (error) {
    console.error('Get room stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;