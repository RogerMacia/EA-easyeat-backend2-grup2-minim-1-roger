import { Schema, model, Types, Document } from 'mongoose';

// 1️⃣ Interface 
// Estenem de Document per incloure les propietats de Mongoose si cal
export interface IVisit {
    _id?: Types.ObjectId;
    customer_id: Types.ObjectId;      // reference to Customer
    restaurant_id: Types.ObjectId;    // reference to Restaurant
    date: Date;
    pointsEarned?: number;
    billAmount?: number;
    // --- NOVES PROPIETATS PER REQUERIMENTS ---
    deletedAt?: Date | null;          // Per al Soft Delete
}

// 2️⃣ Schema
const visitSchema = new Schema<IVisit>({
    customer_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true 
    },
    restaurant_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    },
    date: { 
        type: Date, 
        default: () => new Date(), 
        required: true 
    },
    pointsEarned: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    billAmount: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    // Camp per a l'esborrat tou
    deletedAt: { 
        type: Date, 
        default: null 
    }
}, { 
    timestamps: true, // Crea automàticament createdAt i updatedAt
    versionKey: false 
});

// 3️⃣ Índexs per a Paginació i Cerca (Optimització)
// Indexar per data ajuda a que el .sort({date: -1}) de la paginació sigui ràpid
visitSchema.index({ date: -1 });
visitSchema.index({ customer_id: 1, deletedAt: 1 });

// 4️⃣ Model
export const VisitModel = model<IVisit>('Visit', visitSchema);