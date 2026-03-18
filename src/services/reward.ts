import mongoose from 'mongoose';
import { RewardModel, IReward } from '../models/reward';
import { RestaurantModel } from '../models/restaurant';

const createReward = async (data: Partial<IReward>) => {
    const reward = new RewardModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedReward = await reward.save();

    // Automatically add the new reward ID to the restaurant's rewards array
    if (data.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(data.restaurant_id, {
            $push: { rewards: savedReward._id }
        });
    }

    return savedReward;
};

const getReward = async (rewardId: string) => {
    return await RewardModel.findById(rewardId);
};

const getAllRewards = async () => {
    return await RewardModel.find();
};

const updateReward = async (rewardId: string, data: Partial<IReward>) => {
    const reward = await RewardModel.findById(rewardId);

    if (reward) {
        reward.set(data);
        return await reward.save();
    }

    return null;
};

const deleteReward = async (rewardId: string) => {
    const deletedReward = await RewardModel.findByIdAndDelete(rewardId);
    
    // Automatically remove the reward ID from the restaurant's rewards array
    if (deletedReward && deletedReward.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(deletedReward.restaurant_id, {
            $pull: { rewards: deletedReward._id }
        });
    }

    return deletedReward;
};

export default {
    createReward,
    getReward,
    getAllRewards,
    updateReward,
    deleteReward
};