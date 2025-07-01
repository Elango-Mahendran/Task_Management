import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '../../hooks/useTasks';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  initialData?: Partial<Task>;
  title: string;
}

export function TaskForm({ isOpen, onClose, onSubmit, initialData, title }: TaskFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title || '');
      setValue('description', initialData.description || '');
      setValue('priority', initialData.priority || 'medium');
      setValue('dueDate', initialData.dueDate ? initialData.dueDate.split('T')[0] : '');
    } else {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [initialData, setValue, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      const taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'userId'> = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
        status: initialData?.status || 'pending',
        roomId: initialData?.roomId,
      };

      await onSubmit(taskData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Task Title"
          error={errors.title?.message}
          placeholder="Enter task title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-peach-500 focus:ring-peach-500"
            placeholder="Enter task description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            {...register('priority')}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-peach-500 focus:ring-peach-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <Input
          {...register('dueDate')}
          type="date"
          label="Due Date (Optional)"
          error={errors.dueDate?.message}
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            {initialData ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
