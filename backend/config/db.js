import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://soumya:12345678asS@cluster0.5uv61.mongodb.net/food-del').then(()=>console.log('DB Connected'));
}