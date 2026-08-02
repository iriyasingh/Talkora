import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';    
import path from 'path';


import userRouter from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';
import callRouter from './routes/call.route.js';



import {connectDB} from './lib/db.js';

const app= express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",    credentials: true, // allow frontend to send cookies
}));

app.use(express.json()); 
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/calls", callRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
