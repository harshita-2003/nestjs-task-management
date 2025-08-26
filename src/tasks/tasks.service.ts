import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService{
    constructor(
        private taskRepository : TaskRepository
    ) {}

    getTasks(filterDto : GetTaskFilterDto, user: User) : Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User) : Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    getTaskById(id: string, user: User) : Promise<Task> {
        return this.taskRepository.getTaskById(id, user);
    }

    deleteTask(id: string, user: User) : Promise<void> {
        return this.taskRepository.deleteTask(id, user);
    }

    async updateTaskStatus(id:string , status: TaskStatus, user:User): Promise<Task> {
        return this.taskRepository.updateTaskStatus(id, status, user);
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
