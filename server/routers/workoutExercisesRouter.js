import {Router} from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router();

router.get("/", isAuthorized, async (req, res) => {
    const userId = req.session.user.id;
    const { workoutId } = req.params; 

    const workoutExists = await db.get(`SELECT id FROM workouts WHERE id = ? AND user_id = ?`, workoutId, userId);

    if (!workoutExists) {
        return res.status(404).send({ success: false, message: "Workout not found or unauthorized" });
    }

    const exercises = await db.all(`SELECT * FROM workout_exercises WHERE workout_id = ?`, workoutId); 

    res.send({ data: exercises, success: true, message: "Successfully fetched exercises" });
});

router.post("/", isAuthorized, async (req, res) => {
    const userID = req.session.user.id; 

    workoutId = db.all(`SELECT id FROM workouts WHERE user_id = ?`, userID);


})


export default router; 