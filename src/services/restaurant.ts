import { RestaurantModel, IRestaurant } from '../models/restaurant';

const createRestaurant = async (data: Partial<IRestaurant>): Promise<IRestaurant> => {
    const restaurant = new RestaurantModel({ ...data });
    return await restaurant.save();
};

const getRestaurant = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findById(restaurantId);
};

const getAllRestaurants = async (): Promise<IRestaurant[]> => {
    return await RestaurantModel.find();
};

const updateRestaurant = async (restaurantId: string, data: Partial<IRestaurant>): Promise<IRestaurant | null> => {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (restaurant) {
        restaurant.set(data);
        return await restaurant.save();
    }
    return null;
};

const deleteRestaurant = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findByIdAndDelete(restaurantId);
};

const getRestaurantWithCustomers = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findById(restaurantId).populate('customers', '-restaurant').lean();
};

const getRestaurantFull = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findById(restaurantId)
        .populate('employees')
        .populate('rewards')
        .populate('badges')
        .populate('statistics')
        .lean();
};

const getNearby = async (lng: number, lat: number, maxDistance: number): Promise<IRestaurant[]> => {
    return await RestaurantModel.find({
        'profile.location.coordinates': {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $maxDistance: maxDistance
            }
        }
    }).lean();
};

const getBadges = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findById(restaurantId)
        .select('badges')
        .populate('badges')
        .lean();
};

const getStatistics = async (restaurantId: string): Promise<IRestaurant | null> => {
    return await RestaurantModel.findById(restaurantId)
        .select('statistics')
        .populate('statistics')
        .lean();
};

export default {
    createRestaurant,
    getRestaurant,
    getAllRestaurants,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantWithCustomers: getRestaurantWithCustomers,
    getRestaurantFull,
    getNearby,
    getBadges,
    getStatistics
};