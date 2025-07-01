import { useState, useEffect } from 'react';
import { roomsAPI } from '../lib/api';
import toast from 'react-hot-toast';

export interface Room {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: {
    _id: string;
    fullName: string;
    email: string;
  };
  members: Array<{
    userId: {
      _id: string;
      fullName: string;
      email: string;
    };
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  inviteCode: string;
  isPublic: boolean;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getRooms();
      setRooms(response.data.rooms);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async (name: string, description?: string, isPublic = false) => {
    try {
      const response = await roomsAPI.createRoom({ name, description, isPublic });
      
      setRooms(prev => [response.data.room, ...prev]);
      toast.success('Room created successfully!');
      return response.data.room;
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
      throw error;
    }
  };

  const joinRoom = async (inviteCode: string) => {
    try {
      const response = await roomsAPI.joinRoom(inviteCode);
      
      setRooms(prev => [response.data.room, ...prev]);
      toast.success(`Joined ${response.data.room.name} successfully!`);
      return response.data.room;
    } catch (error: any) {
      console.error('Error joining room:', error);
      const message = error.response?.data?.message || 'Failed to join room';
      toast.error(message);
      throw error;
    }
  };

  const leaveRoom = async (roomId: string) => {
    try {
      await roomsAPI.leaveRoom(roomId);
      
      setRooms(prev => prev.filter(room => room._id !== roomId));
      toast.success('Left room successfully!');
    } catch (error: any) {
      console.error('Error leaving room:', error);
      toast.error('Failed to leave room');
      throw error;
    }
  };

  const updateRoom = async (roomId: string, updates: any) => {
    try {
      const response = await roomsAPI.updateRoom(roomId, updates);
      
      setRooms(prev => prev.map(room => 
        room._id === roomId ? response.data.room : room
      ));
      
      toast.success('Room updated successfully!');
      return response.data.room;
    } catch (error: any) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
      throw error;
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      await roomsAPI.deleteRoom(roomId);
      
      setRooms(prev => prev.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
      throw error;
    }
  };

  return {
    rooms,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoom,
    deleteRoom,
    refetch: fetchRooms,
  };
}