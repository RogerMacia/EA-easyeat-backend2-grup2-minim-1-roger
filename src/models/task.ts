import { boolean, string } from 'joi';
import { Schema, model, Types } from 'mongoose';

// 1️⃣ Interface
export interface ITask {
  _id?: Types.ObjectId;

  restaurant_id: Types.ObjectId;
  tasks: { [key: string]: boolean };  // Key: Description, Boolean: completed, not completed
}

// 2️⃣ Schema
const taskSchema = new Schema<ITask>(
  {
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    tasks: { type: Map, of: Boolean, default: {}, required: true },
  },
  {
    timestamps: true
  }
);

// 3️⃣ Model
export const TaskModel = model<ITask>('Task', taskSchema);