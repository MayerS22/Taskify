import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from './task.entity';

@Entity('task_users')
export class TaskUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, task => task.taskUsers, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, user => user.id, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'viewer' })
  role: 'owner' | 'editor' | 'viewer';
} 