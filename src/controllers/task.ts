import { NextFunction, Request, Response } from 'express';
import TaskService from '../services/task';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedTask = await TaskService.createTask(req.body);
        return res.status(201).json(savedTask);

    } catch (error) {
        return next(error);
    }
};

const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await TaskService.getTask(req.params.taskId);

        return task
            ? res.status(200).json(task)
            : res.status(404).json({ message: 'Task not found' });

    } catch (error) {
        return next(error);
    }
};

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await TaskService.getAllTasks();
        return res.status(200).json(tasks);

    } catch (error) {
        return next(error);
    }
};

const getPaginatedTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await TaskService.getAllTasks();
        const start = Number(req.params.start);
        const end = Number(req.params.end);
        const pagTasks = tasks.slice(start, end);
        return res.status(200).json(pagTasks);

    } catch (error) {
        return next(error);
    }
}

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedTask = await TaskService.updateTask(
            req.params.taskId,
            req.body
        );

        return updatedTask
            ? res.status(200).json(updatedTask)
            : res.status(404).json({ message: 'Task not found' });

    } catch (error) {
        return next(error);
    }
};

const getTaskByRestaurant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await TaskService.getTaskByRestaurant(req.params.restaurantId);
        return res.status(200).json(tasks);

    } catch (error) {
        return next(error);
    }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await TaskService.deleteTask(req.params.taskId);

        return deleted
            ? res.status(200).json({ message: 'Task deleted' })
            : res.status(404).json({ message: 'Task not found' });

    } catch (error) {
        return next(error);
    }
};

export default {
    createTask,
    getTask,
    getAllTasks,
    getPaginatedTask,
    updateTask,
    getTaskByRestaurant,
    deleteTask,
};