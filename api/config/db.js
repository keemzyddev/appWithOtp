import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.connect(
      process.env.MONGO_URI,

      () => {
        console.log(
          `database connected: ${mongoose.connection.host}`.cyan.underline.bold
        );
      },
      mongoose.set("strictQuery", true)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
