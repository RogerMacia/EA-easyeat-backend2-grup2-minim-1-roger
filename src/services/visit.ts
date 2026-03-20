import mongoose from 'mongoose';
import { VisitModel, IVisit } from '../models/visit';

const createVisit = async (data: Partial<IVisit>) => {
    const visit = new VisitModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    return await visit.save();
};

const getVisit = async (visitId: string) => {
    return await VisitModel.findById(visitId);
};

const getAllVisits = async (
    filters: { customer_id?: string; restaurant_id?: string; deletedAt?: any } = {}, 
    page: number = 1, 
    limit: number = 5
) => {
    const query: Record<string, any> = {};

    if (filters.customer_id) query.customer_id = new mongoose.Types.ObjectId(filters.customer_id);
    if (filters.restaurant_id) query.restaurant_id = new mongoose.Types.ObjectId(filters.restaurant_id);
    
    // ✅ Cubre tanto deletedAt: null como documentos sin el campo
    query.$or = [{ deletedAt: null }, { deletedAt: { $exists: false } }];

    const skip = (page - 1) * limit;

    const data = await VisitModel.find(query)
        .populate('customer_id')
        .populate('restaurant_id')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

    const total = await VisitModel.countDocuments(query);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

const getVisitFull = async (visitId: string) => {
    return await VisitModel.findById(visitId)
        .populate('customer_id')
        .populate('restaurant_id');
};

const updateVisit = async (visitId: string, data: Partial<IVisit>) => {
    return await VisitModel.findByIdAndUpdate(visitId, data, { new: true });
};

// SOFT DELETE (Update del camp deletedAt)
const softDeleteVisit = async (id: string) => {
    return await VisitModel.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};

// HARD DELETE (Eliminació física)
const hardDeleteVisit = async (id: string) => {
    return await VisitModel.findByIdAndDelete(id);
};

// Nota: mantenim deleteVisit apuntant a hard per retrocompatibilitat si cal
const deleteVisit = hardDeleteVisit;

export default { 
    createVisit, 
    getVisit, 
    getAllVisits, 
    getVisitFull, 
    updateVisit, 
    deleteVisit, 
    softDeleteVisit, 
    hardDeleteVisit 
};