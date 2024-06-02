import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRouter from "./Routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.use("/auth", authRouter);

app.get("/", function (request, response) {
  response.send("🙋‍♂️, Welcome to User-Authentication System!");
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨ `));
