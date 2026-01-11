import {Router} from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { canViewContent } from '../middleware/privacyMiddleware.js';
import { getPrInformation } from './services/prService.js';
import db from "../database/connection.js";
const router = Router();

router.get("/me", isAuthenticated, async (req, res) => { 
    const userId = req.session.user.id; 

    const prData = await getPrInformation(userId);

    if (!prData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: prData ? prData : {}, success: true }); 
}); 


router.get("/:id", isAuthenticated, canViewContent, async (req, res) => { 
    const profileUserId = parseInt(req.params.id);

    const prData = await getPrInformation(profileUserId);

    if (!prData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: prData ? prData : {}, success: true }); 
}); 

router.post("/me", isAuthenticated, async (req, res) => {
    
    try {
        const userId = req.session.user.id; 
        const { bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max } = req.body;

        if (
            bench_press_kg === undefined &&
            squat_kg === undefined &&
            deadlift_kg === undefined &&
            run_5k_min === undefined &&
            pull_ups_max === undefined
        ) {
            return res.status(400).send({ success: false, message: "No PR data received" });
        }

        await db.run(`
            INSERT INTO pr_data
            (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
            VALUES (?, ?, ?, ?, ?, ?)`, 
            userId, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        );

        return res.send({ success: true, message: "PR data created" }); 
    
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT") {
            return res.status(409).send({
                success: false,
                message: "PR data already exists"
            });
        }

        console.error(err);
        res.status(500).send({ success: false, message: "Server error" });
    }
});

router.put("/me", isAuthenticated, async (req, res) => {
    const userId = req.session.user.id;
    const { bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max } = req.body;

    if (
        bench_press_kg === undefined &&
        squat_kg === undefined &&
        deadlift_kg === undefined &&
        run_5k_min === undefined &&
        pull_ups_max === undefined
    ) {
        return res.status(400).send({ success: false, message: "No PR data received" });
    }

    const existing = await db.get(`SELECT * FROM pr_data WHERE user_id = ?`, userId);
    if (!existing) {
        return res.status(404).send({ success: false, message: "PR data does not exist" });
    }

    await db.run(
        `UPDATE pr_data SET
            bench_press_kg = ?,
            squat_kg = ?,
            deadlift_kg = ?,
            run_5k_min = ?,
            pull_ups_max = ?,
            date_recorded = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        bench_press_kg,
        squat_kg,
        deadlift_kg,
        run_5k_min,
        pull_ups_max,
        userId
    );

    res.send({ success: true, message: "PR data updated" });

}); 

export default router;