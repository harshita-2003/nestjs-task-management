import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdatedTaskStatusDto {
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status : TaskStatus
}