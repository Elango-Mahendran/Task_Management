import { useState, useEffect } from 'react';
import { tasksAPI } from '../lib/api';
import toast from 'react-hot-toast';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  roomId?: {
    _id: string;
    name: string;
  };
  assignedTo?: {
    _id: string;
    fullName: string;
    email: string;
  };
  tags?: string[];
  completedAt?: string;
}

export function useTasks(roomId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (filters?: any) => {
    try {
      setLoading(true);
      let response;
      
      if (roomId) {
        response = await tasksAPI.getRoomTasks(roomId, filters);
      } else {
        response = await tasksAPI.getTasks({ ...filters, roomId: 'personal' });
      }
      
      setTasks(response.data.tasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [roomId]);

  const createTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const response = await tasksAPI.createTask({
        ...taskData,
        roomId: roomId || undefined,
      });
      
      setTasks(prev => [response.data.task, ...prev]);
      toast.success('Task created successfully!');
      return response.data.task;
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await tasksAPI.updateTask(id, updates);
      
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data.task : task
      ));
      
      toast.success('Task updated successfully!');
      return response.data.task;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksAPI.deleteTask(id);
      
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}