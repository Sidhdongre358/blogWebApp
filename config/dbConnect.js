import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.error("Failed to connect witb MONGODB..", error);
  }
};
export default dbConnect;
