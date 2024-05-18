import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});

const newSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("collection", newSchema);

export default collection;
