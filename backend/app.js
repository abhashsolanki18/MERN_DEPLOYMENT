import express from "express";
import cors from "cors";
import multer from "multer";
import { uploadOnCloud } from "./cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import collection from "./mongo.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://mern-deployment-frontend-mu.vercel.app", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  console.log("Received GET request to /");
  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  const { email } = req.body;
  try {
    const check = await collection.findOne({ email });
    res.json(check ? "exist" : "notexist");
  } catch (e) {
    res.status(500).json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;
  const data = { email, name, password };
  try {
    const check = await collection.findOne({ email });
    if (check) {
      res.json("exist");
    } else {
      await collection.insertMany([data]);
      res.json("notexist");
    }
  } catch (e) {
    res.status(500).json("fail");
  }
});

const imageViewCounts = {};

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const imageUrl = await uploadOnCloud(fileBuffer, title, description);
    res.status(200).json({ message: "File uploaded successfully", url: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
});

app.get("/images", async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const folder = "images";

    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        params: {
          expression: `folder:${folder}`,
          type: "upload",
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.CLOUDINARY_API_KEY + ":" + process.env.CLOUDINARY_API_SECRET
          ).toString("base64")}`,
        },
      }
    );

    if (response.data && response.data.resources) {
      const imagesWithViews = response.data.resources.map((image) => {
        const publicId = image.public_id;
        imageViewCounts[publicId] = imageViewCounts[publicId] ? imageViewCounts[publicId] + 1 : 1;
        return {
          public_id: publicId,
          secure_url: image.secure_url,
          views: imageViewCounts[publicId],
          description: image.context?.custom?.description || "",
        };
      });
      res.status(200).json(imagesWithViews);
    } else {
      res.status(404).json({ message: "No images found in the specified folder" });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
