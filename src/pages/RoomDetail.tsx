import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, Copy } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roomsAPI } from '../lib/api';
import toast from 'react-hot-toast';

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(roomId);
  const [room, setRoom] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await roomsAPI.getRoom(roomId!);
      setRoom(response.data.room);
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Failed to load room');
      navigate('/rooms');
    }
  };

  const handleCreateTask = async (taskData: any) => {
    await createTask({ ...taskData, roomId });
  };

  const handleUpdateTask = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const copyInviteCode = () => {
    if (room?.inviteCode) {
      navigator.clipboard.writeText(room.inviteCode);
      toast.success('Invite code copied to clipboard!');
    }
  };

  if (loading || !room) {
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
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/rooms')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Rooms</span>
          </Button>
        </div>

        {/* Room Info */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-peach-600" />
                <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              </div>
              {room.description && (
                <p className="text-gray-600">{room.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="text-sm text-gray-600">
                Invite Code: 
                <button
                  onClick={copyInviteCode}
                  className="ml-2 font-mono font-medium text-peach-600 hover:text-peach-700 flex items-center space-x-1"
                >
                  <span>{room.inviteCode}</span>
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </Card>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TaskCard
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onEdit={handleEditTask}
              />
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks in this room yet</h3>
            <p className="text-gray-600 mb-6">
              Create the first task to get your team started!
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </div>
        )}

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        />
      </div>
    </div>
  );
}