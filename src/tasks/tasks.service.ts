import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService{
    constructor(
        @InjectRepository(Task)
        private taskRepository : Repository<Task>
    ) {}


    async getTasks(filterDto : GetTaskFilterDto) : Promise<Task[]> {
        const {status , search} = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');

        if (status){
            query.andWhere('task.status = :status', {status});
        }

        if(search) {
            query.andWhere('task.title ILIKE :search OR task.description ILIKE :search', {search: `%${search}%`});
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        const {title , description} = createTaskDto;
        const newTask = this.taskRepository.create({
            title,
            description,
            status : TaskStatus.OPEN,
        })
        await this.taskRepository.save(newTask);
        return newTask;
    }


    async getTaskById(id: string) : Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id } });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async deleteTask(id: string) : Promise<void> {
        const result = await this.taskRepository.delete(id);
        console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return;
    }

    async updateTaskStatus(id:string , status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
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
