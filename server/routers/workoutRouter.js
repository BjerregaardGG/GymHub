import {Router} from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { canViewContent } from '../middleware/privacyMiddleware.js';
import { getWorkoutsWithExercisesById } from './services/workoutService.js';
import db from "../database/connection.js";

const router = Router();

// collects the workouts and their exercises for the logged in user
router.get("/me", isAuthenticated, async (req, res) => {
    const userId = req.session.user.id; 

    const workouts = await getWorkoutsWithExercisesById(userId);

    if (workouts.length === 0) {
        return res.send({
            data: [],
            success: true,
            message: "No workouts found"
        });
    }

    res.send({ 
        data: workouts, 
        success: true, 
        message: "Successfully fetched workouts with exercises" 
    });
});

// collects the workouts a specific user
router.get("/:id", isAuthenticated, canViewContent, async (req, res) => {
    const userId = req.params.id;

    const workouts = await getWorkoutsWithExercisesById(userId);

    if (workouts.length === 0) {
        return res.send({
            data: [],
            success: true,
            message: "No workouts found"
        });
    }

    res.send({ 
        data: workouts, 
        success: true, 
        message: "Successfully fetched workouts with exercises" 
    });
});

// creates a new workout with exercises
router.post("/me", isAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const {title, description, exercises } = req.body; 

    if (!title || !description) {
        return res.status(400).send({ success: false, message: "No Workout data recieved" });
    }

    try {
        const postWorkoutQuery = `
            INSERT INTO workouts
            (user_id, title, description) 
            VALUES (?, ?, ?)
        `

        const result = await db.run(postWorkoutQuery, userId, title, description);
        const workoutID = result.lastID;

        const exercisePromises = exercises.map(async (exercise) => {

            const postExercisesQuery = `
            INSERT INTO workout_exercises
            (workout_id, name, sets, reps, weight_kg)
            VALUES (?, ?, ?, ?, ?)
            `
            await db.run(postExercisesQuery, workoutID, exercise.name, exercise.sets, exercise.reps, exercise.weight_kg);
        
        });

        await Promise.all(exercisePromises); // We wait for all exercises

        return res.send({ success: true, message: "Workout created" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

// sub route 
import commentsRouter from "./commentsRouter.js"
router.use("/:id/comments", commentsRouter); 

export default router; 