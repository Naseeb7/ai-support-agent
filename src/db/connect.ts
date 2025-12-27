import mongoose from 'mongoose';
import { MONGO_URI } from '../config/db';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    throw error;
  }
};