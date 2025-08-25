import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService{
    private logger = new Logger()
    constructor(
        @InjectRepository(Task)
        private taskRepository : Repository<Task>
    ) {}


    async getTasks(filterDto : GetTaskFilterDto, user: User) : Promise<Task[]> {
        const {status , search} = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');
        query.where({ user });

        if (status){
            query.andWhere('task.status = :status', {status});
        }

        if(search) {
            query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', {search: `%${search}%`});
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException();
        }
        
    }

    async createTask(createTaskDto: CreateTaskDto, user: User) : Promise<Task> {
        const {title , description} = createTaskDto;
        const newTask = this.taskRepository.create({
            title,
            description,
            status : TaskStatus.OPEN,
            user,
        })
        await this.taskRepository.save(newTask);
        return newTask;
    }


    async getTaskById(id: string, user: User) : Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, user } });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async deleteTask(id: string, user: User) : Promise<void> {
        const result = await this.taskRepository.delete({ id, user});
        console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return;
    }

    async updateTaskStatus(id:string , status: TaskStatus, user:User): Promise<Task> {
        const task = await this.getTaskById(id,user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

}


// code if data is not stored in database

// export class TasksService {
//     private tasks : Task[] = [];

//     getAllTasks() : Task[] {
//         return this.tasks;
//     }

//     createTask(createTaskDto : CreateTaskDto) : Task {
//         const {title , description} = createTaskDto;

//         const newTask : Task = {
//             id : uuid(),
//             title,
//             description,
//             status : TaskStatus.OPEN,
//         }
//         this.tasks.push(newTask);
//         return newTask;
//     }

//     getTaskById(id: string) : Task {
//         const found = this.tasks.find((task) => task.id === id);
//         if (!found) {
//             throw new NotFoundException(`Task with ID "${id}" not found`);
//         }
//         return found;
//     }

//     deleteTask(id: string) : void {
//         const found = this.getTaskById(id);
//         this.tasks = this.tasks.filter((task) => task.id !== found.id);
//     }

//     updateTask(id:string , status: TaskStatus): Task {
//         const task = this.getTaskById(id);
//         task.status = status;
//         return task;
//     }

//     getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
//         const {status , search} = filterDto;
//         let tasks = this.getAllTasks();
//         if (status) {
//             tasks = tasks.filter(task => task.status === status);
//         }
//         if (search) {
//             tasks = tasks.filter(task => 
//                 task.title.includes(search) || task.description.includes(search)
//             );
//         }
//         return tasks;
//     }

// }
