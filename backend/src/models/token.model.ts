import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  type: { type: String, enum: ['refresh', 'reset', 'verify'], required: true },
  expires: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema);
