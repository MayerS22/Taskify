import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskUser } from './task-user.entity';
import { Invitation } from './invitation.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { ShareTaskDto } from './dtos/share-task.dto';
import { InviteTaskDto } from './dtos/invite-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(TaskUser) private taskUserRepo: Repository<TaskUser>,
    @InjectRepository(Invitation) private invitationRepo: Repository<Invitation>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Create a new task (owner only)
  async createTask(createTaskDto: CreateTaskDto, owner: User) {
    const task = this.taskRepo.create({ ...createTaskDto, owner });
    const saved = await this.taskRepo.save(task);
    // Add owner to TaskUser as 'owner'
    const taskUser = this.taskUserRepo.create({ task: saved, user: owner, role: 'owner' });
    await this.taskUserRepo.save(taskUser);
    return saved;
  }

  // Get all tasks owned or shared with the user
  async getUserTasks(user: User) {
    // Find all TaskUser entries for this user
    const taskUsers = await this.taskUserRepo.find({ where: { user }, relations: ['task'] });
    return taskUsers.map(tu => tu.task);
  }

  // Get a single task by id, only if user has access
  async getTaskById(id: number, user: User) {
    const taskUser = await this.taskUserRepo.findOne({ where: { task: { id }, user }, relations: ['task'] });
    if (!taskUser) throw new NotFoundException('Task not found or access denied');
    return taskUser.task;
  }

  // Update a task (owner or editor only)
  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: User) {
    const taskUser = await this.taskUserRepo.findOne({ where: { task: { id }, user }, relations: ['task'] });
    if (!taskUser) throw new NotFoundException('Task not found or access denied');
    if (taskUser.role !== 'owner' && taskUser.role !== 'editor') throw new ForbiddenException('No permission to edit');
    Object.assign(taskUser.task, updateTaskDto);
    return this.taskRepo.save(taskUser.task);
  }

  // Delete a task (owner only)
  async deleteTask(id: number, user: User) {
    const taskUser = await this.taskUserRepo.findOne({ where: { task: { id }, user }, relations: ['task'] });
    if (!taskUser) throw new NotFoundException('Task not found or access denied');
    if (taskUser.role !== 'owner') throw new ForbiddenException('Only owner can delete');
    await this.taskRepo.delete(id);
    return { message: 'Task deleted' };
  }

  // Delete all tasks (for development use only)
  async deleteAllTasks() {
    await this.taskUserRepo.delete({});
    await this.invitationRepo.delete({});
    await this.taskRepo.delete({});
    return { message: 'All tasks deleted' };
  }
} 