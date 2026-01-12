import {Router} from "express";
import { hashPassword, verifyPassword } from "../util/encryption.js";
import db from "../database/connection.js";

const router = Router();

// Authentication - login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await db.get('SELECT * FROM users WHERE email = ?;', email); 

    if (!user) {
        return res.send({ success: false, message: "Could not find user" });
    }

    const validatePassword = await verifyPassword(password, user.password);

    if (!validatePassword) {
        return res.send({ success: false, message: "Wrong password" });
    }

    req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.is_private
    };

    res.send({ success: true, message: "User is logged in"});
});

// Authentication - create user 
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const user = await db.get('SELECT * FROM users WHERE email = ?;', email)

    if (user) {
        return res.send({ success: false, message: "User with this email already exists" })
    }

    const hashedPassword = await hashPassword(password, 14);
    const defaultRole = "USER"; 

    try {
        await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?);', name, email, hashedPassword, defaultRole);
        res.send({ success: true, message: "User is created"});
    } catch (error) {
        res.send({ succes: false, message: "Failed to create user"});
    }
});

import { resetEmail, initMailer } from "../util/nodeMailer.js";
await initMailer(); 
const resetToken = {}; // object to save token in memory

// Authentication - forgot user 
router.post("/forgot-password", async (req, res) => {
    const email = req.body.email; 

    const user = await db.get('SELECT * FROM users WHERE email = ?;', email);

    if (!user) {
        return res.send({ success: false, message: "User with this email does not exist" }); 
    }

    const token = Math.random().toString(36);
    resetToken[token] = { email, expires: Date.now() + 3600000 }; // resets in an hour 

    let resetLink = `http://localhost:5173/reset-password?token=${token}`;

    try {
        await resetEmail(email, resetLink); 
        res.send({ success: true, message: "Reset password email has been sent" });
    } catch (error) {
        res.send({ success: false, message: "Could not send email" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    // checks if the temporary token exists 
    const tokenData = resetToken[token];

    // Checks if the token exists
    if (!tokenData || tokenData.expires < Date.now()) {
        if (tokenData) {
            delete resetToken[token]; // if expired 
        }
        return res.send({ success: false, message: "Did not find the token" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword, 14);

    // Find the user based on email from the token
    const userEmail = tokenData.email;
    const user = db.get('SELECT * FROM users WHERE email = ?;', userEmail)

    // If the user does not exist
    if (!user) {
        delete resetToken[token];
        return res.send({ success: false, message: "The user does not exist" });
    }

    try {
        await db.run('UPDATE users SET password = ? WHERE email = ?;', hashedPassword, userEmail);
        delete resetToken[token];

        res.send({ success: true, message: "The password has been reset successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to update password in database" });
    }
});

// destroys the session if user logs out
router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.send({ success: false, message: "Could not sign out" })
        }

        res.send({ success: true, message: "You are signed out"});
    });
}); 

export default router; 