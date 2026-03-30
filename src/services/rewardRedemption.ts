import mongoose from 'mongoose';
import { RewardRedemptionModel, IRewardRedemption } from '../models/rewardRedemption';

const createRewardRedemption = async (data: Partial<IRewardRedemption>) => {
    const redemption = new RewardRedemptionModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await redemption.save();
};

const getRewardRedemption = async (redemptionId: string) => {
    return await RewardRedemptionModel.findById(redemptionId);
};

const getAllRewardRedemptions = async (): Promise<IRewardRedemption[]>=> {
    return await RewardRedemptionModel.find();
};

const updateRewardRedemption = async (redemptionId: string, data: Partial<IRewardRedemption>) => {
    const redemption = await RewardRedemptionModel.findById(redemptionId);

    if (redemption) {
        redemption.set(data);
        return await redemption.save();
    }

    return null;
};

const deleteRewardRedemption = async (redemptionId: string) => {
    return await RewardRedemptionModel.findByIdAndDelete(redemptionId);
};

export default { createRewardRedemption, getRewardRedemption, getAllRewardRedemptions, updateRewardRedemption, deleteRewardRedemption };
