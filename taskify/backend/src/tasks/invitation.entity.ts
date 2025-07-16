import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  task: Task;

  @Column()
  email: string;

  @Column({ default: 'viewer' })
  role: 'editor' | 'viewer';

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'expired';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 