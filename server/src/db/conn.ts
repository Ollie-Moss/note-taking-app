import mongoose, { Mongoose } from "mongoose";

async function InitializeMongoose(connectionString: string = process.env.ATLAS_URI || ""): Promise<Mongoose | null> {
    try {
        return mongoose.connect(connectionString);
    } catch (e) {
        console.error(e);
    }
    return null
}

export default InitializeMongoose;
