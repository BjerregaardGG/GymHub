import 'dotenv/config'; 
import express from 'express';
const app = express();

app.use(express.json()); 
app.use(express.static("public"));

import cors from 'cors';
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

import sessionMiddleware from "./util/session.js";
app.use(sessionMiddleware);

import {genralLimiter, authLimiter} from "./util/rateLimit.js";
app.use(genralLimiter);
app.use("/auth", authLimiter); 

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import userRouter from "./routers/userRouter.js";
app.use("/api", userRouter);

import prRouter from "./routers/prRouter.js";
app.use("/api", prRouter);

import workoutRouter from "./routers/workoutRouter.js";
app.use("/api", workoutRouter);


const PORT = 8080 || Number(process.env.PORT);
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
});