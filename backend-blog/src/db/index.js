import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL?.trim();
    if (!mongoUrl) {
      throw new Error(
        "MONGODB_URL is missing. Set it in your environment or in a .env file."
      );
    }

    // Prefer putting the DB name directly in the connection string, but keep a safe default.
    const connection = await mongoose.connect(mongoUrl, { dbName: "blogApp" });
    console.log(`MONGO DB CONNECT || DB_HOST ${connection.connection.host}`);
  } catch (error) {
    console.log("MONGODB CONNECTION FAILD ERROR : ", error);
    process.exit(1);
  }
};

export default connectDB;
