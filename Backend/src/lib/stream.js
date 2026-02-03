import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('STREAM_API_KEY and STREAM_API_SECRET must be defined in environment variables');
    throw new Error('STREAM_API_KEY and STREAM_API_SECRET must be defined in .env file');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        // Only send essential data to Stream - image must be a URL, not base64
        // Stream has a 5KB limit for user custom data
        const streamUserData = {
            id: userData.id,
            name: userData.name,
        };
        
        // Only include image if it's a URL (not base64)
        if (userData.image && !userData.image.startsWith('data:')) {
            streamUserData.image = userData.image;
        }
        
        // Server-side API uses upsertUsers with an object containing users array
        await streamClient.upsertUsers([streamUserData]);
        if (process.env.NODE_ENV !== 'production') {
            console.log("Stream user upserted successfully:", streamUserData.id);
        }
        return streamUserData;
    } catch (error) {
        console.error("Error upserting Stream user:", error.message);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = String(userId);
        const token = streamClient.createToken(userIdStr);
        return token;
    }
    catch (error) {
        console.error("Error generating Stream token:", error);
        throw error;
    }
};

export default streamClient;