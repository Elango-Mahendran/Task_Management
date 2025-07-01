import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useRooms } from '../hooks/useRooms';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { rooms } = useRooms();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    totalRooms: rooms.length,
    currentStreak: user?.currentStreak || 0,
  };

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'text-peach-600 bg-peach-100',
      change: '+12%',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: Target,
      color: 'text-green-600 bg-green-100',
      change: '+8%',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100',
      change: '+5%',
    },
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
      change: '+2 days',
    },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last week</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Progress Overview</h2>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">View All Tasks</Button>
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                  <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-peach-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Recent Tasks</h3>
                {recentTasks.length > 0 ? (
                  <div className="space-y-2">
                    {recentTasks.map((task) => (
                      <div key={task._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <span className={`flex-1 text-sm ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/tasks" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Create New Task
                  </Button>
                </Link>
                <Link to="/rooms" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Join a Room
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Rooms Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Rooms</h2>
              {rooms.length > 0 ? (
                <div className="space-y-3">
                  {rooms.slice(0, 3).map((room) => (
                    <div key={room._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-4 w-4 text-peach-600" />
                      <span className="flex-1 text-sm font-medium text-gray-900">{room.name}</span>
                    </div>
                  ))}
                  {rooms.length > 3 && (
                    <Link to="/rooms">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all {rooms.length} rooms
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No rooms yet</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}