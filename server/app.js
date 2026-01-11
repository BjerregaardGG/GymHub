import 'dotenv/config'; 
import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; // our websocket server 

const app = express();
const server = http.createServer(app);

const onlineUsers = {}; 

app.use(express.json()); 
app.use("/uploads", express.static("uploads")) // profile pictures

import cors from 'cors';
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // we include cookies 
}));

// Session middleware
import sessionMiddleware from "./util/session.js";
app.use(sessionMiddleware);

import {genralLimiter, authLimiter} from "./util/rateLimit.js";
app.use(genralLimiter);
app.use("/auth", authLimiter); 

// Initializing socket.io with CORS
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
        
        socket.broadcast.emit('friend-status-update', { 
            userId: userId, 
            isOnline: true 
        });
        
    } else {
        console.log(`[Socket] Unknown user connected.`);
    }

    // When disconnecting...
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
app.use("/api/auth", authRouter);

import userRouter from "./routers/userRouter.js";
app.use("/api/users", userRouter);

import prRouter from "./routers/prRouter.js";
app.use("/api/prs", prRouter);

import relationsRouter from "./routers/relationsRouter.js"
app.use("/api/relations", relationsRouter({ onlineUsers })); // we send the onlineUsers object for the initial online status

import workoutRouter from "./routers/workoutRouter.js";
app.use("/api/workouts", workoutRouter);

const PORT = 8080 || Number(process.env.PORT);
server.listen(PORT, () => {
    console.log('Server running on port', PORT)
});