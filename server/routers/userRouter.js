import { Router } from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import { canViewContent } from '../middleware/privacyMiddleware.js';
import db from "../database/connection.js";
const router = Router();

router.get("/users", isAuthorized, async (req, res) => {

    const userData = await db.all('SELECT id, name, role FROM users');

    res.send({ data: userData, success: true});
});

router.get("/users/profile", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const users = await db.all(`SELECT id, name, image_path FROM users WHERE id = ?;`, userId);

    const userData = users[0];

    res.send({ data: userData, success: true});
});

router.get("/users/profile/:id", isAuthorized, async (req, res) => {
    const userId = req.params.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Could not find user"});
    }

    const users = await db.all(`SELECT name, image_path FROM users WHERE id = ?;`, userId);

    const userData = users[0];

    res.send({ data: userData, success: true});
})

router.get("/users/prdata", isAuthorized, async (req, res) => { 
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const trainingDataQuery = `
        SELECT 
            bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        FROM 
            pr_data 
        WHERE 
            user_id = ?
    `;

    let userTrainingData; 

    try {
        userTrainingData = await db.all(trainingDataQuery, userId );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Could not fetch training data" });
    };

    const userData = userTrainingData[0]; 

    if (!userData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: userData, success: true }); 
}); 


router.get("/users/prdata/:userId", isAuthorized, canViewContent, async (req, res) => { 
    const userId = req.params.userId;

    if (!userId) {
        return res.status(401).send({ success: false, message: "Could not find user"})
    }

    const trainingDataQuery = `
        SELECT 
            bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max
        FROM 
            pr_data 
        WHERE 
            user_id = ?
    `;

    let userTrainingData; 

    try {
        userTrainingData = await db.all(trainingDataQuery, userId );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Could not fetch training data" });
    };

    const userData = userTrainingData[0]; 

    if (!userData) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: userData, success: true }); 
}); 

export default router;