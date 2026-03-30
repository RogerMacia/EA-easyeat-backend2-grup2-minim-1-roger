import mongoose from 'mongoose';
import { DishModel, IDish } from '../models/dish';
import { RestaurantModel } from '../models/restaurant';

const createDish = async (data: Partial<IDish>) => {
    const dish = new DishModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedDish = await dish.save();

    if (data.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(data.restaurant_id, {
            $push: { dishes: savedDish._id }
        });
    }

    return savedDish;
};

const getDish = async (dishId: string) => {
    return await DishModel.findById(dishId);
};

const getAllDishes = async (): Promise<IDish[]> => {
    return await DishModel.find();
};

const updateDish = async (dishId: string, data: Partial<IDish>) => {
    const dish = await DishModel.findById(dishId);

    if (dish) {
        dish.set(data);
        return await dish.save();
    }

    return null;
};

const deleteDish = async (dishId: string) => {
    const deletedDish = await DishModel.findByIdAndDelete(dishId);

    if (deletedDish && deletedDish.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(deletedDish.restaurant_id, {
            $pull: { dishes: deletedDish._id }
        });
    }

    return deletedDish;
};

export default { createDish, getDish, getAllDishes, updateDish, deleteDish };
