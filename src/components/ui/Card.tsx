import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px -5px rgba(255, 218, 185, 0.1)' } : {}}
      className={`
        bg-white rounded-xl shadow-soft border border-peach-100
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}