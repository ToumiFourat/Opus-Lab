import mongoose from 'mongoose';

export interface IPermission extends mongoose.Document {
  name: string;
}

const permissionSchema = new mongoose.Schema<IPermission>({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model<IPermission>('Permission', permissionSchema);
