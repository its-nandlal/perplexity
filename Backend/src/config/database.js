import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Specific error handling
    if (error.name === "MongoNetworkError") {
      console.error("Network error - check if MongoDB is running");
    } else if (error.name === "MongoParseError") {
      console.error("Invalid MongoDB connection string");
    } else if (error.name === "MongoServerSelectionError") {
      console.error("Cannot connect to MongoDB server");
    }

    throw error;
  }
};

export default connectDB;
