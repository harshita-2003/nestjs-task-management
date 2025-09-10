import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdatedTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CustomLoggerService } from 'src/logger/logger.service';

@Controller('tasks')
//whole controller is protected , cant access any route without token
@UseGuards(AuthGuard())
export class TasksController{
    
    constructor(private tasksService: TasksService, private readonly logger: CustomLoggerService) {}

    @Get()
    getTasks(@Query() filterDto : GetTaskFilterDto, @GetUser() user: User) : Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id:string, @GetUser() user: User) : Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTaskDto : CreateTaskDto, @GetUser() user: User) : Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User) : Promise<void> {
        return this.tasksService.deleteTask(id,user);
    }

    @Patch('/:id/status')
    updateTask( @Param('id') id: string,  @Body() updateTaskDto: UpdatedTaskStatusDto, @GetUser() user:User) : Promise<Task> {
        const {status} = updateTaskDto;
        return this.tasksService.updateTaskStatus(id, status, user);
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
