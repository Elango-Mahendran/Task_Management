import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, Trash2, CheckCircle2, Circle, PlayCircle, User } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { Task } from '../../hooks/useTasks';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <PlayCircle className="h-5 w-5 text-blue-600" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleStatusChange = async () => {
    setIsUpdating(true);
    try {
      const nextStatus = task.status === 'completed' ? 'pending' :
                        task.status === 'pending' ? 'in_progress' : 'completed';
      await onUpdate(task._id, { status: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';

  return (
    <Card hover className="p-4 group">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleStatusChange}
              disabled={isUpdating}
              className="mt-0.5 hover:scale-110 transition-transform"
            >
              {getStatusIcon(task.status)}
            </button>
            
            <div className="flex-1 space-y-1">
              <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              
              {/* Room info */}
              {task.roomId && (
                <div className="flex items-center space-x-1 text-xs text-peach-600">
                  <User className="h-3 w-3" />
                  <span>{task.roomId.name}</span>
                </div>
              )}
              
              {/* Assigned to */}
              {task.assignedTo && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <User className="h-3 w-3" />
                  <span>Assigned to {task.assignedTo.fullName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-peach-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task._id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              {format(new Date(task.createdAt), 'MMM d')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}