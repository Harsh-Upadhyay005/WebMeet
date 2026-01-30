import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Get all users
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`Total users in database: ${users.length}`);
        console.log('Users:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}, FullName: ${user.fullName}`);
        });
        
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
