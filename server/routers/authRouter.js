import {Router} from "express";
const router = Router();

const users = [
    { id: 1, email: "Ole@hej.dk", password: "1233" },
    { id: 2, email: "Nanna@huhu.dk", password: "1212" }
];

import { hashPassword, verifyPassword } from "../util/encryption.js";

// authorization
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email == email);

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

router.post("/auth/createuser", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email == email); 

    if (user) {
        return res.send({ data: user.email, success: false, message: "User with this email already exists" })
    }

    const hashedPassword = await hashPassword(password, 14);
    const newUser = { email: email, password: hashedPassword };
    users.push(newUser);

    res.send({ data: "", success: true, message: "User is created"});
});

// Authenticates which routes the user has access to 
function authenticateUser(req, res, next){
    // this simulates checking in the database 
    const isUser = true; 

    // REMEMBER TO CREATE A SESSION SOMEWHERE AROUND HERE
    if (isUser) {
        req.isAdmin = isAdmin; 
        // simulates getting username from the database
        req.username = "Johnnie"
        return next(); // for at undgå header fejl
    } else {
        res.status(403).send({ data: "You need to be admin"})
    }
};

export default router; 