import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a unique username"],
      unique: [true, "Username Exists!"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email address"],
      unique: false,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model.Users || mongoose.model("User", UserSchema);
