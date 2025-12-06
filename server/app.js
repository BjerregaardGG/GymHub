import 'dotenv/config'; 
import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; 

const app = express();
const server = http.createServer(app);

const onlineUsers = {}; 

app.use(express.json()); 
app.use(express.static("public"));

import cors from 'cors';
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Session middleware
import sessionMiddleware from "./util/session.js";
app.use(sessionMiddleware);

import {genralLimiter, authLimiter} from "./util/rateLimit.js";
app.use(genralLimiter);
app.use("/auth", authLimiter); 

// Initializing socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

// Connects the session with the socket
io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
    const userId = socket.request.session.user?.id;
    
    if (userId) {
        console.log(`[Socket] user ${userId} (${socket.id}) connected`);
        
        // Register the user as online 
        onlineUsers[userId] = socket.id;
        console.log(onlineUsers);
        
        // emits to all the sockets but itself
        socket.broadcast.emit('friend-status-update', { 
            userId: userId, 
            isOnline: true 
        });
        
    } else {
        console.log(`[Socket] Unknown user connected.`);
    }

    // Håndter frakobling
    socket.on("disconnect", () => {
        if (userId && onlineUsers[userId]) {
            console.log(`[Socket] User ${userId} disconnected.`);
                
            // Removes the user from online users
            delete onlineUsers[userId];
                
            socket.broadcast.emit('friend-status-update', { 
                userId: userId, 
                isOnline: false 
            });
        }
        console.log("Socket disconnected", socket.id);
    });
});

// Routers 
import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import userRouter from "./routers/userRouter.js";
app.use("/api", userRouter);

import friendsRouter from "./routers/friendsRouter.js"
app.use("/api", friendsRouter({ onlineUsers })); // we send the onlineUsers object for the initial status

import prRouter from "./routers/prRouter.js";
app.use("/api", prRouter);

import workoutRouter from "./routers/workoutRouter.js";
app.use("/api", workoutRouter);

const PORT = 8080 || Number(process.env.PORT);
server.listen(PORT, () => {
    console.log('Server running on port', PORT)
});