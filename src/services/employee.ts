import mongoose from 'mongoose';
import { EmployeeModel, IEmployee } from '../models/employee';
import { RestaurantModel } from '../models/restaurant';

const createEmployee = async (data: Partial<IEmployee>) => {
    const employee = new EmployeeModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedEmployee = await employee.save();

    if (data.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(data.restaurant_id, {
            $push: { employees: savedEmployee._id }
        });
    }

    return savedEmployee;
};

const getEmployee = async (employeeId: string) => {
    return await EmployeeModel.findById(employeeId);
};

const getAllEmployees = async (): Promise<IEmployee[]> => {
    return await EmployeeModel.find();
};

const updateEmployee = async (employeeId: string, data: Partial<IEmployee>) => {
    const employee = await EmployeeModel.findById(employeeId);

    if (employee) {
        employee.set(data);
        return await employee.save();
    }

    return null;
};

const deleteEmployee = async (employeeId: string) => {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);

    if (deletedEmployee && deletedEmployee.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(deletedEmployee.restaurant_id, {
            $pull: { employees: deletedEmployee._id }
        });
    }

    return deletedEmployee;
};

export default { createEmployee, getEmployee, getAllEmployees, updateEmployee, deleteEmployee };
