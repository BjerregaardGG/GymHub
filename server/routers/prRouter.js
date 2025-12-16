import {Router} from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import { canViewContent } from '../middleware/privacyMiddleware.js';
import db from "../database/connection.js";
const router = Router();

router.get("/me", isAuthorized, async (req, res) => { 
    const userId = req.session.user.id; 

    const trainingDataQuery = `
        SELECT 
            bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        FROM 
            pr_data 
        WHERE 
            user_id = ?
    `;

    let userData; 

    try {
        userData = await db.get(trainingDataQuery, userId );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Could not fetch training data" });
    };

    if (!userData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: userData, success: true }); 
}); 


router.get("/:id", isAuthorized, canViewContent, async (req, res) => { 
    const userId = req.params.id;

    const trainingDataQuery = `
        SELECT 
            bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        FROM 
            pr_data 
        WHERE 
            user_id = ?
    `;

    let userData; 

    try {
        userData = await db.get(trainingDataQuery, userId );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Could not fetch training data" });
    };

    if (!userData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: userData, success: true }); 
}); 


router.post("/me", isAuthorized, async (req, res) => {
    const userId = req.session.user.id
    const { bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max } = req.body;

    if (!bench_press_kg && !squat_kg && !deadlift_kg && !run_5k_min && !pull_ups_max) {
        return res.status(400).send({ success: false, message: "No PR data received" });
    }

    try {
        const existingUsers = await db.all(`SELECT * FROM pr_data WHERE user_id = ?;`, userId);
        const user = existingUsers[0];

        const updateQuery = `
            UPDATE pr_data SET
                bench_press_kg = ?, squat_kg = ?, deadlift_kg = ?, run_5k_min = ?, 
                pull_ups_max = ?, date_recorded = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `;

        const postQuery = `
            INSERT INTO pr_data 
            (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // update pr_data
        if (user) {
            await db.run(updateQuery, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max, userId);
            return res.send({ success: true, message: "PR data updated" });
            
        } else {
        // create new pr_data
            await db.run(postQuery, userId, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max);
            return res.send({ success: true, message: "PR data created" }); 
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

export default router;