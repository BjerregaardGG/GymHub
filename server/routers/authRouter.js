import {Router} from "express";
import { users } from "./userRouter.js";
import { hashPassword, verifyPassword } from "../util/encryption.js";

const router = Router();

// Authentication - login 
router.post("/auth/login", async (req, res) => {
    console.log("Body received:", req.body); 
    const { email, password } = req.body;

    const user = users.find(user => user.email.toLowerCase() == email.toLowerCase());

    if (!user) {
        return res.send({ data: "", success: false, message: "Could not find user" });
    }

    const validatePassword = await verifyPassword(password, user.password);
    if (!validatePassword) {
        return res.send({ data: "", success: false, message: "Wrong password" });
    }

    req.session.user = {email: user.email};

    res.send({data: "", success: true, message: "User is logged in"});
});

let nextId = 6;

// Authentication - create user 
router.post("/auth/createuser", async (req, res) => {
    console.log("Body received:", req.body); 
    const { email, password } = req.body;

    const user = users.find(user => user.email.toLowerCase() == email.toLowerCase());

    if (user) {
        return res.send({ data: user.email, success: false, message: "User with this email already exists" })
    }

    const hashedPassword = await hashPassword(password, 14);
    console.log(hashedPassword);
    const newUser = { id: nextId++, email: email, password: hashedPassword };
    users.push(newUser);

    res.send({ data: "", success: true, message: "User is created"});
});

import { resetEmail, initMailer } from "../util/nodeMailer.js";
await initMailer(); 
const resetToken = {};

// Authentication - forgot user 
router.post("/auth/forgotpassword", async (req, res) => {
    console.log("Email recieved", req.body); 
    const email = req.body.email; 

    const user = users.find(user => user.email.toLowerCase() == email.toLowerCase());

    if (!user) {
        return res.send({success: false, message: "User with this email does not exist" }); 
    }

    const token = Math.random().toString(36);
    console.log(token);
    resetToken[token] = { email, expires: Date.now() + 3600000 }; // resets in an hour 

    let resetLink = `http://localhost:5173/reset-password?token=${token}`;

    try {
        resetEmail(email, resetLink); 
        res.send({ success: true, message: "Reset password email has been sent" });
    } catch (error) {
        res.send({ success: false, message: "Could not send email" });
        console.log(error);
    }
});

router.post("/auth/resetpassword", async (req, res) => {
    const { token, newPassword } = req.body;

    // Checks if the token exists
    const tokenData = resetToken[token];
    if (!tokenData || tokenData.expires < Date.now()) {
        if (tokenData) {
            delete resetToken[token];
        }
        return res.send({ success: false, message: "Did not find the token" });
    }
    // Find the user based on email from the token
    const userEmail = tokenData.email;
    const user = users.find(user => user.email == userEmail);

    if (!user) {
        return res.send({ success: false, message: "The user does not exist" });
    }

    user.password = await hashPassword(newPassword, 14); 
    delete resetToken[token];

    res.send({ success: true, message: "The password has been reset" });
});

// destroys the session if user logs out
router.post("/auth/signout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
        return res.send({ success: false, message: "Could not sign out" })
        }

        res.send({ success: true, message: "You are signed out"});
    });
}); 

export default router; 