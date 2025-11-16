import {Router} from "express";
const router = Router();

// destroys the session if user logs out
router.get("/logout", (req, res) => {
    // setting session values as undefined is just as good 
    req.session.destroy(() => {
        res.send({ message: "The user is logged out"})
    });
})

export default router; 

