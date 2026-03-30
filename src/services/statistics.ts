import mongoose from 'mongoose';
import { StatisticsModel, IStatistics } from '../models/statistics';
import { RestaurantModel } from '../models/restaurant';

const createStatistics = async (data: Partial<IStatistics>) => {
    const statistics = new StatisticsModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    const savedStatistics = await statistics.save();

    if (data.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(data.restaurant_id, {
            statistics: savedStatistics._id
        });
    }

    return savedStatistics;
};

const getStatistics = async (statisticsId: string) => {
    return await StatisticsModel.findById(statisticsId);
};

const getAllStatistics = async(): Promise<IStatistics[]> => {
    return await StatisticsModel.find();
};

const updateStatistics = async (statisticsId: string, data: Partial<IStatistics>) => {
    const statistics = await StatisticsModel.findById(statisticsId);

    if (statistics) {
        statistics.set(data);
        return await statistics.save();
    }

    return null;
};

const deleteStatistics = async (statisticsId: string) => {
    const deleted = await StatisticsModel.findByIdAndDelete(statisticsId);

    if (deleted && deleted.restaurant_id) {
        await RestaurantModel.findByIdAndUpdate(deleted.restaurant_id, {
            $unset: { statistics: '' }
        });
    }

    return deleted;
};

export default { createStatistics, getStatistics, getAllStatistics, updateStatistics, deleteStatistics };
