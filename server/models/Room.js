import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    allowMemberInvite: {
      type: Boolean,
      default: true
    },
    autoAssignTasks: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Generate unique invite code
roomSchema.pre('save', function(next) {
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Add member method
roomSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(member => 
    member.userId.toString() === userId.toString()
  );
  
  if (!existingMember) {
    this.members.push({ userId, role });
  }
  
  return this.save();
};

// Remove member method
roomSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.userId.toString() !== userId.toString()
  );
  
  return this.save();
};

export default mongoose.model('Room', roomSchema);