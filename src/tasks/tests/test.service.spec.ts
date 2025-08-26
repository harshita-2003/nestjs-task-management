import { Test } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { TaskRepository } from '../task.repository';
import { Task } from '../task.entity';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from '../task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  getTaskById: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};


describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
        providers: [
            TasksService,
            { provide: TaskRepository, useFactory: mockTaskRepository },
        ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TaskRepository);
    });

    // describe('getTasks', () => {
    //     it('calls TasksRepository.getTasks and returns the result', async () => {
    //         tasksRepository.getTasks.mockResolvedValue('someValue');
    //         const result = await tasksService.getTasks(null, mockUser);
    //         expect(result).toEqual('someValue');
    //     });
    // });

    describe('createTask', () => {
        it('calls taskRepository.createTask and returns the result', async () => {
            const mockTask = {} as Task;
            tasksRepository.createTask.mockResolvedValue(mockTask);

            const createTaskDto: CreateTaskDto = { title: 'Test task', description: 'Test desc' };
            const user: User = { id: 'userId', username: 'TestUser' } as User;

            const result = await tasksService.createTask(createTaskDto, user);
            expect(tasksRepository.createTask).toHaveBeenCalledWith(createTaskDto, user);
            expect(result).toEqual(mockTask);
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.getTaskById and returns the result', async () => {
            const mockTask = {} as Task;
            tasksRepository.getTaskById.mockResolvedValue(mockTask);

            const id = 'someId';
            const user: User = { id: 'userId', username: 'TestUser' } as User;

            const result = await tasksService.getTaskById(id, user);
            expect(tasksRepository.getTaskById).toHaveBeenCalledWith(id, user);
            expect(result).toEqual(mockTask);
        });
    });

    describe('deleteTask', () => {
            it('calls taskRepository.deleteTask', async () => {
            tasksRepository.deleteTask.mockResolvedValue(undefined);

            const id = 'someId';
            const user: User = { id: 'userId', username: 'TestUser' } as User;

            await tasksService.deleteTask(id, user);
            expect(tasksRepository.deleteTask).toHaveBeenCalledWith(id, user);
        });
    });

    describe('updateTaskStatus', () => {
        it('calls taskRepository.updateTaskStatus and returns the result', async () => {
            const mockTask = {} as Task;
            tasksRepository.updateTaskStatus.mockResolvedValue(mockTask);

            const id = 'someId';
            const status = TaskStatus.IN_PROGRESS;
            const user: User = { id: 'userId', username: 'TestUser' } as User;

            const result = await tasksService.updateTaskStatus(id, status, user);
            expect(tasksRepository.updateTaskStatus).toHaveBeenCalledWith(id, status, user);
            expect(result).toEqual(mockTask);
        });
    });
});
