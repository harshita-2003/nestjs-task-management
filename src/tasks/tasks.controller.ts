import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { TasksService } from './tasks.service'
import type { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdatedTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
//whole controller is protected , cant access any route without token
@UseGuards(AuthGuard())
export class TasksController{
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto : GetTaskFilterDto) : Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string) {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto : CreateTaskDto) : Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string) : Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    updateTask( @Param('id') id: string,  @Body() updateTaskDto: UpdatedTaskStatusDto) : Promise<Task> {
        const {status} = updateTaskDto;
        return this.tasksService.updateTaskStatus(id, status);
    }
}



// export class TasksController {
//     constructor(private tasksService : TasksService) {}

//     @Get()
//     getTasks(@Query() filterDto : GetTaskFilterDto) : Task[] {
//         // If we have a filter defined, call tasksService.getTasksWithFilters
//         // Otherwise, return all tasks
//         if (Object.keys(filterDto).length) {
//             return this.tasksService.getTasksWithFilters(filterDto);
//         }else {
//             return this.tasksService.getAllTasks();
//         }
//     }

//     @Post()
//     createTask(@Body() createTaskDto: CreateTaskDto) : Task {
//         return this.tasksService.createTask(createTaskDto);
//     }

//     @Get('/:id')
//     getTaskById(@Param('id') id: string) : Task {
//         return this.tasksService.getTaskById(id);
//     }

//     @Delete('/:id')
//     deleteTask(@Param('id') id: string) : void {
//         this.tasksService.deleteTask(id);
//     }   

//     @Patch('/:id/status')
//     updateTask( @Param('id') id: string,  @Body() updateTaskDto: UpdatedTaskStatusDto) : Task {
//         return this.tasksService.updateTask(id, updateTaskDto.status);
//     }
// }
