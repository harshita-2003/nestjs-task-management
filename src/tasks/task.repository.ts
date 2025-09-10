import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { GetTaskFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/logger/logger.service";


@Injectable()
export class TaskRepository{
    constructor(
        @InjectRepository(Task)
        private readonly repo: Repository<Task>,
        private readonly logger: CustomLoggerService
    ) {}

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.repo.createQueryBuilder('task');
        query.where({ user });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${
                user.username
                }". Filters: ${JSON.stringify(filterDto)}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.repo.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
        });

        await this.repo.save(task);
        return task;
    }

    async getTaskById(id: string, user: User) : Promise<Task> {
        const found = await this.repo.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async deleteTask(id: string, user: User) : Promise<void> {
        const result = await this.repo.delete({ id, user});
        console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return;
    }

    async updateTaskStatus(id:string , status: TaskStatus, user:User): Promise<Task> {
        const task = await this.getTaskById(id,user);
        task.status = status;
        await this.repo.save(task);
        return task;
    }
}