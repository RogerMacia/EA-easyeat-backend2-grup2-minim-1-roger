import { Schema, model, Types, Model } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ICustomer {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    refreshTokenHash?: string;
    isActive: boolean;
    profilePictures?: string[];
    pointsWallet?: Types.ObjectId[];
    visitHistory?: Types.ObjectId[];
    favoriteRestaurants?: Types.ObjectId[];
    badges?: Types.ObjectId[];
    reviews?: Types.ObjectId[];
}

// Instance methods are declared separately so Mongoose can type them correctly
export interface ICustomerMethods {
    /**
     * Compares a plain-text candidate password against the stored bcrypt hash.
     * Returns true if they match, false otherwise.
     */
    comparePassword(candidatePassword: string): Promise<boolean>;
}

type CustomerModel = Model<ICustomer, {}, ICustomerMethods>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const customerSchema = new Schema<ICustomer, CustomerModel, ICustomerMethods>(
    {
        name:               { type: String, required: true },
        email:              { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
        // select: false ensures the password hash is never returned in queries by default
        password:           { type: String, select: false },
        refreshTokenHash:   { type: String },
        isActive:           { type: Boolean, default: true },
        profilePictures:    [{ type: String }],
        pointsWallet:       [{ type: Schema.Types.ObjectId, ref: 'PointsWallet' }],
        visitHistory:       [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
        favoriteRestaurants:[{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
        badges:             [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
        reviews:            [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    },
    { timestamps: true }
);

// ─── Pre-save hook: hash password ─────────────────────────────────────────────

customerSchema.pre('save', async function () {
    // Skip hashing if the password field was not modified (e.g. only email changed)
    if (!this.isModified('password') || !this.password) return;

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: verify password ─────────────────────────────────────────

customerSchema.method('comparePassword', async function (candidatePassword: string): Promise<boolean> {
    // this.password may be undefined if the field was not selected in the query —
    // callers should use .select('+password') when fetching a customer for login.
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
});

// ─── Model ────────────────────────────────────────────────────────────────────

export const CustomerModel = model<ICustomer, CustomerModel>('Customer', customerSchema);