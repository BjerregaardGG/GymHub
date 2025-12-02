import {Router} from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router();

// collects the workouts and their exercises 
router.get("/workouts", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const userWorkouts = await db.all(`SELECT * FROM workouts WHERE user_id = ?`, userId);

    if (userWorkouts.length === 0) {
        return res.send({ data: [], success: true, message: "No workouts found" });
    }

    const workoutsPlusExercisesPromises = userWorkouts.map(async (workout) => {
        const exercises = await db.all(
            `SELECT * FROM workout_exercises WHERE workout_id = ?`, 
            workout.id
        );

        return { ...workout, exercises: exercises };
    });

    const workoutsPlusExercises = await Promise.all(workoutsPlusExercisesPromises);

    res.send({ 
        data: workoutsPlusExercises, 
        success: true, 
        message: "Successfully fetched workouts with exercises" 
    });
});

// creates a new workout with exercises
router.post("/workouts", isAuthorized, async (req, res) => {
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

export default router; 