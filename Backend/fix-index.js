import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndex() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // List all indexes
        const indexes = await mongoose.connection.db.collection('users').indexes();
        console.log('Current indexes:', JSON.stringify(indexes, null, 2));
        
        // Delete all users to start fresh
        const result = await mongoose.connection.db.collection('users').deleteMany({});
        console.log(`Deleted ${result.deletedCount} users`);
        
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixIndex();
