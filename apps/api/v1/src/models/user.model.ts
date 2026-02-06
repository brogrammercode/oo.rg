import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: String },
    bio: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zip: { type: String },
    address: { type: String },

}, { timestamps: true });

const User = mongoose.model("users", userSchema);

export default User;