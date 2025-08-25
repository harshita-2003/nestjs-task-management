import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ unique: true })
    username :string;

    @Column({ select: false })
    password : string;

    @OneToMany(_type => Task , task => task.user, { eager: true })  //eager true: whenever we fetch user, fetch tasks automatically
    tasks: Task[];
}