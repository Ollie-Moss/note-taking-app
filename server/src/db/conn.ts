import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || "";

async function InitializeMongoose() {
    try {
        mongoose.connect(connectionString);
    } catch (e) {
        console.error(e);
    }
}

export default InitializeMongoose;
