import mongoose from 'mongoose';
import { TaskModel, ITask } from '../models/task';

// ========================
// CREATE
// ========================
const createTask = async (data: Partial<ITask>): Promise<ITask> => {
    const task = new TaskModel(data);
    return await task.save();
};

// ========================
// GET ONE
// ========================
const getTask = async (taskId: string): Promise<ITask | null> => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return null;

    return await TaskModel.findById(taskId)
        .populate('restaurant_id')
        .lean();
};

// ========================
// GET ALL
// ========================
const getAllTasks = async (): Promise<ITask[]> => {
    return await TaskModel.find()
        .populate('restaurant_id')
        .lean();
};

// ========================
// UPDATE
// ========================
const updateTask = async ( taskId: string, data: Partial<ITask> ): Promise<ITask | null> => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return null;
    
    delete data._id;
    delete data.restaurant_id;
    return await TaskModel.findOneAndUpdate(
        { _id: taskId },
        data,
        { new: true }
    ).lean();
};

// ========================
// GET BY RESTAURANT
// ========================
const getTaskByRestaurant = async (restaurantId: string): Promise<ITask[]> => {
    return await TaskModel.find({
        restaurant_id: new mongoose.Types.ObjectId(restaurantId)
    })
        .populate('restaurant_id')
        .lean();
};


// ========================
// DELETE TASK
// ========================
const deleteTask = async (taskId: string): Promise<ITask | null> => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) return null;

    return await TaskModel.findByIdAndDelete(taskId).lean();
}

export default {
    createTask,
    getTask,
    getAllTasks,
    updateTask,
    getTaskByRestaurant,
    deleteTask,
};
