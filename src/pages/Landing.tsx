import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Users, Zap, Shield } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Card } from '../components/ui/Card';

export function Landing() {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Organize, prioritize, and track your tasks with our intuitive interface.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Create rooms and collaborate with your team on shared projects.',
    },
    {
      icon: Zap,
      title: 'Productivity Insights',
      description: 'Track your progress with detailed analytics and streak counters.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-peach-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Organize Your Life with
                <span className="text-peach-500 block">TM</span>
              </h1> 
              <p className="text-xl text-gray-600 max-w-lg">
                The beautiful task management app that helps you stay organized,
                collaborate with your team, and achieve your goals.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-4 h-full">
                    <div className="space-y-3">
                      <div className="bg-peach-100 p-2 rounded-lg w-fit">
                        <feature.icon className="h-6 w-6 text-peach-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="p-8 max-w-md mx-auto">
              {isLogin ? (
                <LoginForm onToggleMode={() => setIsLogin(false)} />
              ) : (
                <SignupForm onToggleMode={() => setIsLogin(true)} />
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}