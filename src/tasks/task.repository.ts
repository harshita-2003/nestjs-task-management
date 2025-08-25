import { Repository, Entity, Column } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { Injectable } from "@nestjs/common";

//depricated in typeorm v0.3.x
// therefore we will use Repository directly in service
@Injectable()
export class TaskRepository extends Repository<Task> {


}