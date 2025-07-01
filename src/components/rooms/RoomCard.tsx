import React from 'react';
import { Users, Lock, Globe, Calendar, Crown, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { Room } from '../../hooks/useRooms';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
  currentUserId?: string;
}

export function RoomCard({ room, onJoin, currentUserId }: RoomCardProps) {
  const userMember = room.members.find(member => member.userId._id === currentUserId);
  const isOwner = room.ownerId._id === currentUserId;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3 text-yellow-600" />;
      case 'admin': return <Shield className="h-3 w-3 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <Card hover className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
              {userMember && getRoleIcon(userMember.role)}
            </div>
            {room.description && (
              <p className="text-gray-600 text-sm">{room.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {room.isPublic ? (
              <Globe className="h-4 w-4 text-green-600" />
            ) : (
              <Lock className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{room.members.length} member{room.members.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(room.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            Owner: <span className="font-medium text-gray-700">{room.ownerId.fullName}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Invite Code: <span className="font-mono font-medium text-peach-600">{room.inviteCode}</span>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button
            size="sm"
            onClick={() => onJoin(room)}
          >
            View Room
          </Button>
        </div>
      </div>
    </Card>
  );
}