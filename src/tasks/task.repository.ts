import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";

//depricated in typeorm v0.3.x
// therefore we will use Repository directly in service
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

}