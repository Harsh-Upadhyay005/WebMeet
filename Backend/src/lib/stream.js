import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error('STEAM_API_KEY and STEAM_API_SECRET must be defined in .env file');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        // Server-side API uses upsertUsers with an object containing users array
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        const token = streamClient.createToken(userId);
        return token;
    }
    catch (error) {
        console.error("Error generating Stream token:", error);
    }
};

export default streamClient;