import mongoose from 'mongoose';
import { BadgeModel, IBadge } from '../models/badge';

const createBadge = async (data: Partial<IBadge>) => {
    const badge = new BadgeModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await badge.save();
};

const getBadge = async (badgeId: string) => {
    return await BadgeModel.findById(badgeId);
};

const getAllBadges = async (): Promise<IBadge[]> => {
    return await BadgeModel.find()
};

const updateBadge = async (badgeId: string, data: Partial<IBadge>) => {
    const badge = await BadgeModel.findById(badgeId);

    if (badge) {
        badge.set(data);
        return await badge.save();
    }

    return null;
};

const deleteBadge = async (badgeId: string) => {
    return await BadgeModel.findByIdAndDelete(badgeId);
};

export default {
    createBadge,
    getBadge,
    getAllBadges,
    updateBadge,
    deleteBadge
};
