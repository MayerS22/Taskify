import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { TaskUser } from './task-user.entity';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'Other' })
  category: string;

  @Column({ type: 'varchar', default: 'todo' })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.id, { eager: true })
  owner: User;

  @OneToMany(() => TaskUser, taskUser => taskUser.task)
  taskUsers: TaskUser[];
} 