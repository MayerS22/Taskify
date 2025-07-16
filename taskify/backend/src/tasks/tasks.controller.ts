import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(dto, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return this.tasksService.getUserTasks(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    return this.tasksService.getTaskById(Number(id), req.user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.updateTask(Number(id), dto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.tasksService.deleteTask(Number(id), req.user);
  }
} 