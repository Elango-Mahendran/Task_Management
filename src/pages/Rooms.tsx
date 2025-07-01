import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Search } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/rooms/RoomCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Rooms() {
  const { rooms, loading, createRoom, joinRoom } = useRooms();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createRoom(roomName, roomDescription);
      setIsCreateModalOpen(false);
      setRoomName('');
      setRoomDescription('');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    try {
      await joinRoom(inviteCode);
      setIsJoinModalOpen(false);
      setInviteCode('');
    } finally {
      setJoining(false);
    }
  };

  const handleRoomClick = (room: any) => {
    navigate(`/rooms/${room._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peach-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Rooms</h1>
            <p className="text-gray-600 mt-2">
              Collaborate with your team on shared projects
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join Room
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RoomCard room={room} onJoin={handleRoomClick} currentUserId={user?._id} />
            </motion.div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first room or join an existing one to start collaborating!
            </p>
            <div className="flex space-x-4 justify-center">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
              <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>
                Join Room
              </Button>
            </div>
          </div>
        )}

        {/* Create Room Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Room"
        >
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <Input
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-peach-500 focus:ring-peach-500"
                placeholder="Describe the purpose of this room"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={creating}
                className="flex-1"
              >
                Create Room
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Join Room Modal */}
        <Modal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          title="Join Room"
        >
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <Input
              label="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter 6-character invite code"
              required
              maxLength={6}
            />

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={joining}
                className="flex-1"
              >
                Join Room
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsJoinModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}