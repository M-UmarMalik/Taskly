import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log('Data Base connect ho gaya')
    } catch (error) {
        console.log(`Error: ${error}`)
    }
};

export default connectDB;