import db from "../../database/connection.js";

export async function getPrInformation(userId){

    const trainingDataQuery = `
        SELECT 
            id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        FROM 
            pr_data 
        WHERE 
            user_id = ?
    `;

    let userData; 

    try {
        userData = await db.get(trainingDataQuery, userId );
    } catch (error) {
        console.error("DB error in getPrInformation:", error);
        return null; 
    };

    return userData;

};