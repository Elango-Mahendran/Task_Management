import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Room from '../models/Room.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, roomId, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = { userId: req.user._id };
    
    // Add filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (roomId && roomId !== 'personal') {
      query.roomId = roomId;
    } else if (roomId === 'personal') {
      query.roomId = { $exists: false };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tasks = await Task.find(query)
      .populate('roomId', 'name')
      .populate('assignedTo', 'fullName email')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
    
    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks for a specific room
router.get('/room/:roomId', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status, priority, search } = req.query;
    
    // Check if user is member of the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const isMember = room.members.some(member => 
      member.userId.toString() === req.user._id.toString()
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    let query = { roomId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tasks = await Task.find(query)
      .populate('userId', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json({ tasks });
  } catch (error) {
    console.error('Get room tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1 }),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).optional(),
  body('status').isIn(['pending', 'in_progress', 'completed']).optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, dueDate, roomId, assignedTo, tags } = req.body;

    // If roomId provided, check if user is member
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      
      const isMember = room.members.some(member => 
        member.userId.toString() === req.user._id.toString()
      );
      
      if (!isMember) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user._id,
      roomId: roomId || undefined,
      assignedTo: assignedTo || undefined,
      tags: tags || []
    });

    await task.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalTasks: 1 }
    });

    const populatedTask = await Task.findById(task._id)
      .populate('roomId', 'name')
      .populate('assignedTo', 'fullName email');

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', [
  authenticateToken,
  body('title').trim().isLength({ min: 1 }).optional(),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).optional(),
  body('status').isIn(['pending', 'in_progress', 'completed']).optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task or is in the same room
    let canUpdate = task.userId.toString() === req.user._id.toString();
    
    if (!canUpdate && task.roomId) {
      const room = await Room.findById(task.roomId);
      if (room) {
        canUpdate = room.members.some(member => 
          member.userId.toString() === req.user._id.toString()
        );
      }
    }

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Handle status change to completed
    const wasCompleted = task.status === 'completed';
    const isNowCompleted = updates.status === 'completed';
    
    if (!wasCompleted && isNowCompleted) {
      updates.completedAt = new Date();
      
      // Update user stats and streak
      const user = await User.findById(task.userId);
      if (user) {
        user.completedTasks += 1;
        user.updateStreak();
        await user.save();
      }
    } else if (wasCompleted && updates.status !== 'completed') {
      updates.completedAt = null;
      
      // Decrease completed tasks count
      await User.findByIdAndUpdate(task.userId, {
        $inc: { completedTasks: -1 }
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate('roomId', 'name')
      .populate('assignedTo', 'fullName email');

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user owns the task or is room owner
    let canDelete = task.userId.toString() === req.user._id.toString();
    
    if (!canDelete && task.roomId) {
      const room = await Room.findById(task.roomId);
      if (room && room.ownerId.toString() === req.user._id.toString()) {
        canDelete = true;
      }
    }

    if (!canDelete) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(id);

    // Update user stats
    const updateData = { $inc: { totalTasks: -1 } };
    if (task.status === 'completed') {
      updateData.$inc.completedTasks = -1;
    }
    
    await User.findByIdAndUpdate(task.userId, updateData);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.query;
    
    let matchQuery = { userId: req.user._id };
    if (roomId && roomId !== 'personal') {
      matchQuery.roomId = roomId;
    } else if (roomId === 'personal') {
      matchQuery.roomId = { $exists: false };
    }

    const stats = await Task.aggregate([
      { $match: matchQuery },
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
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$status', 'completed'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0
    };

    res.json({ stats: result });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;