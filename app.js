import express from 'express';
const app = express();

//import helmet from 'helmet';
//app.use(helmet());

import session from "./util/session.js";
app.use(session);

import {genralLimiter, authLimiter} from "./util/rateLimit.js";
app.use(genralLimiter);
app.use("/auth", authLimiter); 

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import sessionRouter from "./routers/sessionRouter.js";
app.use(sessionRouter);


const PORT = 8080 || process.env.PORT;
app.use(PORT, () => {
    console.log('Server running on port', PORT)
})