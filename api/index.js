import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import { connectDb } from "./config/db.js";
dotenv.config();
import userRouter from "./routes/route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //less hackers know about our stack

app.get("/", (req, res) => {
  res.status(200).json("Home Get Request");
});

app.use("/api", userRouter);

connectDb()
  .then(() => {
    try {
      app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`));
    } catch (error) {
      console.log("Cannot connect to the server!");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...");
  });
