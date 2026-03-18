import { Schema, model, Types, Model, QueryWithHelpers, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ICustomer {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    refreshTokenHash?: string;
    isActive?: boolean;
    deletedAt?: Date | null;        // null = alive, Date = soft-deleted
    profilePictures?: string[];
    pointsWallet?: Types.ObjectId[];
    visitHistory?: Types.ObjectId[];
    favoriteRestaurants?: Types.ObjectId[];
    badges?: Types.ObjectId[];
    reviews?: Types.ObjectId[];
}

export interface ICustomerMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * TResult stays generic so `.active()` works correctly on both
 * `.find()` (returns array) and `.findOne()` (returns single doc).
 * Using a fixed array type here was the source of the TS2322 error.
 */
export interface ICustomerQueryHelpers {
    active<TResult>(
        this: QueryWithHelpers<TResult, HydratedDocument<ICustomer>, ICustomerQueryHelpers>
    ): QueryWithHelpers<TResult, HydratedDocument<ICustomer>, ICustomerQueryHelpers>;
}

// Thread query helpers through both Model and Schema generics
type CustomerModelType = Model<ICustomer, ICustomerQueryHelpers, ICustomerMethods>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const customerSchema = new Schema<
    ICustomer,
    CustomerModelType,
    ICustomerMethods,
    ICustomerQueryHelpers          // ← 4th generic = query helpers
>(
    {
        name:               { type: String, required: true },
        email:              { type: String, required: true, unique: true, match: /.+@.+\..+/ },
        password:           { type: String, select: false },
        refreshTokenHash:   { type: String },
        isActive:           { type: Boolean, default: true },
        // Soft-delete marker — indexed for fast filtering in list queries
        deletedAt:          { type: Date, default: null, index: true },
        profilePictures:    [{ type: String }],
        pointsWallet:       [{ type: Schema.Types.ObjectId, ref: 'PointsWallet' }],
        visitHistory:       [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
        favoriteRestaurants:[{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
        badges:             [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
        reviews:            [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    },
    { timestamps: true }
);

// ─── Query helper: reusable filter for "alive" documents ──────────────────────
// Usage: CustomerModel.find().active()  or  CustomerModel.findOne().active()
customerSchema.query.active = function <TResult>(this: QueryWithHelpers<TResult, HydratedDocument<ICustomer>, ICustomerQueryHelpers>) {
    return this.where({ deletedAt: null });
};

// ─── Pre-save hook: hash password ─────────────────────────────────────────────

customerSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: verify password ─────────────────────────────────────────

customerSchema.method('comparePassword', async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
});

// ─── Model ────────────────────────────────────────────────────────────────────

export const CustomerModel = model<ICustomer, CustomerModelType>('Customer', customerSchema);