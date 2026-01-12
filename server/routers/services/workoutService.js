import db from "../../database/connection.js";

export async function getWorkoutsWithExercisesById(userId) {
    const userWorkouts = await db.all(`SELECT * FROM workouts WHERE user_id = ? ORDER BY date_recorded DESC`, userId);

    if (userWorkouts.length === 0) {
        return [];
    }

    // maps workouts --> array of promises 
    const workoutsWithExercises = await Promise.all(
        userWorkouts.map(async (workout) => {
            const exercises = await db.all(
                `SELECT * FROM workout_exercises WHERE workout_id = ?`,
                workout.id
            );

            return {
                ...workout,
                exercises
            };
        })
    );

    return workoutsWithExercises;
}