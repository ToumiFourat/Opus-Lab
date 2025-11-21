import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import { authLimiter, apiLimiter } from './middleware/rate-limit.middleware';
import roleRoutes from './routes/role.routes';
import permissionRoutes from './routes/permission.routes';
import meRoutes from './routes/me.routes';
import userRoutes from './routes/user.routes';
dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/me', meRoutes);

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
