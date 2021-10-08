import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { threadId } from 'worker_threads';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(
        `Task with id: ${id} was not found`,
        'description',
      );
    }
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    // const deleted = await this.tasksRepository.delete(id);
    const deleted = await this.tasksRepository.delete(id);
    console.log(deleted);

    if (deleted.affected === 0) {
      throw new NotFoundException(
        `Task with id: ${id} was not found`,
        'description',
      );
    }
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    this.tasksRepository.save(task);
    return task;
  }
}
