import {Router} from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router();

router.get("/workouts", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const userWorkouts = await db.all(`SELECT * FROM workouts WHERE user_id = ?`, userId);

    res.send({ data: userWorkouts, success: true, message: "Sucessfully fetched workouts" })
})

router.post("/workouts", isAuthorized, async (req, res) => {
    const userId = req.session.user.id;
    const {title, description} = req.body; 

    if (!title || !description) {
        return res.status(400).send({ success: false, message: "No Workout data recieved" });
    }

    try {
        const postWorkoutQuery = `
            INSERT INTO workouts
            (user_id, title, description) 
            VALUES (?, ?, ?)
        `
        await db.run(postWorkoutQuery, userId, title, description);
        return res.send({ success: true, message: "Workout created" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

export default router; 