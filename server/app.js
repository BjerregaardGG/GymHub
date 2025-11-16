import 'dotenv/config'; 
import express from 'express';
const app = express();

app.use(express.json()); 

//import helmet from 'helmet';
//app.use(helmet());

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

import sessionRouter from "./routers/sessionRouter.js";
app.use(sessionRouter);

const PORT = 8080 || Number(process.env.PORT);
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})