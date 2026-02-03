import { generateStreamToken } from '../lib/stream.js';


export async function getStreamToken(req, res) {
    try {
        const token = await generateStreamToken(req.user._id);
        
        if (!token) {
            console.error("Failed to generate Stream token");
            return res.status(500).json({ message: "Failed to generate Stream token" });
        }
        
        res.status(200).json({token});
    } catch (error) {
        console.error("Error generating Stream token:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Internal Server Error" });
    }
}