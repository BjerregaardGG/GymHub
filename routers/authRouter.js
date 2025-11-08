import {Router} from "express";
const router = Router();

// Authenticates if the user already has a user
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
}

router.post("/auth/login", authenticateUser, (req, res) => {
    const { username, password } = req.body;
    
    console.log("User is logged in");
    res.send({ message: `Welcome back, ${req.username}` });
})

router.post("/auth/createUser", authenticateUser, (req, res) => {
    console.log("User is created")
    res.send({ message: `User ${req.username} created successfully` });
});

export default router; 