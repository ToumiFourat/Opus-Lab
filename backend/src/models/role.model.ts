import mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
  name: string;
  permissions: mongoose.Types.ObjectId[];
}

const roleSchema = new mongoose.Schema<IRole>({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
}, { timestamps: true });

export default mongoose.model<IRole>('Role', roleSchema);
