import mongoose, { Mongoose } from "mongoose";

// Connect to Mongodb using mongoose
// Uses ATLAS_URI env variable for connection string
async function InitializeMongoose(connectionString: string = process.env.ATLAS_URI || ""): Promise<Mongoose | null> {
    try {
        // attempt connetion to db
        return mongoose.connect(connectionString);
    } catch (e) {
        // throw error if connection fails
        console.error(e);
        console.log('There was an error connecting to MongoDB')
        process.exit(0)
    }
}

export default InitializeMongoose;
