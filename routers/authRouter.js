import {Router} from "express";
const router = Router();

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
}

// authorization
router.post("/auth/login", authenticateUser, (req, res) => {
    const { username, password } = req.body;

    // if user exists in the database
    // const isSame = await verifyPassword(password, user.hashedPassword)
    // if (isSame) --> 
    console.log("User is logged in");
    res.send({ message: `Welcome back, ${req.username}` });
})

router.post("/auth/createUser", authenticateUser, (req, res) => {
    const { username, password } = req.body;

    // if user does NOT exisists in database 
    // const hashedpassword = await hashPassword(password); 
    // add user to database with hashed password 

    console.log("User is created")
    res.send({ message: `User ${username} created successfully` });
});

export default router; 