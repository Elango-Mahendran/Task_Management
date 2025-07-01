import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Target, TrendingUp, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { tasks } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [saving, setSaving] = useState(false);

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    currentStreak: user?.currentStreak || 0,
    maxStreak: user?.maxStreak || 0,
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would typically call an API to update the profile
      // For now, we'll just update the local state
      await updateProfile({ fullName });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and view your productivity stats
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      loading={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-peach-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-peach-600" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {user?.fullName || 'No name set'}
                        </h3>
                        <p className="text-gray-600">Full Name</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-sage-100 p-3 rounded-full">
                    <Mail className="h-8 w-8 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user?.email}</h3>
                    <p className="text-gray-600">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-cream-300 p-3 rounded-full">
                    <Calendar className="h-8 w-8 text-cream-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </h3>
                    <p className="text-gray-600">Member Since</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Productivity Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Productivity Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-peach-600" />
                    <span className="text-gray-600">Total Tasks</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalTasks}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.completedTasks}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">In Progress</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.inProgressTasks}</span>
                </div>

                {stats.totalTasks > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-peach-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Streaks */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Streaks</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.currentStreak}</h3>
                  <p className="text-gray-600">Current Streak</p>
                </div>

                <div className="text-center pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900">{stats.maxStreak}</h3>
                  <p className="text-gray-600">Best Streak</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}