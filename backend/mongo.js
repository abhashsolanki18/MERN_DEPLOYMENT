import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("Error: MONGO_URI is not defined in environment variables");
  process.exit(1); // Exit process with failure
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,  // Timeout after 5s if server is not found
  socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
})
.then(() => {
  console.log("MongoDB connected");
})
.catch((error) => {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1); // Exit process with failure
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
