import mongoose from 'mongoose';

export let connetdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected :', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);  // 1 means failure
    }
};

export default mongoose;
