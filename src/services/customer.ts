import mongoose from 'mongoose';
import { CustomerModel, ICustomer } from '../models/customer';
import { softDeleteDocument, restoreDocument } from '../utils/softDelete';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationOptions {
    page?:  number;   // 1-based, default 1
    limit?: number;   // default 20
}

export interface PaginatedResult<T> {
    data:       T[];
    total:      number;
    page:       number;
    totalPages: number;
}

// ─── Create ───────────────────────────────────────────────────────────────────

const createCustomer = async (data: Partial<ICustomer>) => {
    const customer = new CustomerModel({
        _id: new mongoose.Types.ObjectId(),
        ...data,
    });
    return customer.save();
};

// ─── Read (single) ────────────────────────────────────────────────────────────

/**
 * Returns the customer only if it is NOT soft-deleted.
 * Pass `includeDeleted: true` to bypass the filter (admin use-cases).
 */
const getCustomer = async (customerId: string, includeDeleted = false) => {
    const query = CustomerModel.findById(customerId);
    return includeDeleted ? query : query.where({ deletedAt: null });
};

// ─── Read (paginated list — active only) ──────────────────────────────────────

/**
 * Returns a paginated list of **active** customers.
 * Automatically filters out any document where deletedAt is set.
 */
const getAllCustomers = async (
    { page = 1, limit = 20 }: PaginationOptions = {}
): Promise<PaginatedResult<ICustomer>> => {
    const skip  = (page - 1) * limit;
    const filter = { deletedAt: null };          // ← hard filter; soft-deleted docs never appear

    const [data, total] = await Promise.all([
        CustomerModel.find(filter).skip(skip).limit(limit).lean(),
        CustomerModel.countDocuments(filter),
    ]);

    return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

// ─── Update ───────────────────────────────────────────────────────────────────

const updateCustomer = async (customerId: string, data: Partial<ICustomer>) => {
    // Only update documents that are still active
    const customer = await CustomerModel.findOne({ _id: customerId, deletedAt: null });
    if (!customer) return null;

    customer.set(data);
    return customer.save();
};

// ─── Soft Delete ──────────────────────────────────────────────────────────────

/**
 * Soft-delete: sets isActive=false and stamps deletedAt.
 * The document is kept in the database and can be restored.
 */
const softDeleteCustomer = async (customerId: string) => {
    return softDeleteDocument(CustomerModel, customerId);
};

// ─── Restore ─────────────────────────────────────────────────────────────────

/**
 * Reverses a soft-delete. Clears deletedAt and sets isActive=true.
 */
const restoreCustomer = async (customerId: string) => {
    return restoreDocument(CustomerModel, customerId);
};

// ─── Hard Delete (admin only) ─────────────────────────────────────────────────

/**
 * Permanently removes the document from the database.
 * Should be protected by an admin-only middleware in the router.
 */
const hardDeleteCustomer = async (customerId: string) => {
    return CustomerModel.findByIdAndDelete(customerId);
};

export default {
    createCustomer,
    getCustomer,
    getAllCustomers,
    updateCustomer,
    softDeleteCustomer,
    restoreCustomer,
    hardDeleteCustomer,
};