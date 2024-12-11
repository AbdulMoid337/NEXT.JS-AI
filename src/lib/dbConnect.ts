import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected to DataBase");
        return
    }
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        const db = await mongoose.connect(uri);
        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected Successfully");
        
    } catch (error) {
        console.log("Database connection failed:", error);
        process.exit(1)
    }
}

export default dbConnect;