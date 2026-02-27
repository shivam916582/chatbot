import express from "express";
import routes from "./routes/chatbot.route.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const uri = process.env.mongo_uri;

// MongoDB connection + start server only after DB connects
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Database connected");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Routes
app.use("/bot/v1", routes);

// Optional health check route (very useful for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
