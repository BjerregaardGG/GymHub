import {Router} from 'express';
import { isAuthorized, isAdmin } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router();

router.get("/users", isAuthorized, isAdmin, async (req, res) => {

    const userData = await db.all('SELECT id, name, role FROM users');

    res.send({ data: userData, success: true});
});

router.get("/users/profile", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const users = await db.all(`SELECT name, image_path FROM users WHERE id = ?;`, userId);

    const userData = users[0];

    res.send({ data: userData, success: true});
});

router.get("/users/prdata", isAuthorized, async (req, res) => {    
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const trainingDataQuery = `
        SELECT 
            u.name, p.bench_press_kg, p.squat_kg, p.deadlift_kg, p.run_5k_min, p.pull_ups_max
        FROM 
            users u
        LEFT JOIN
            pr_data p ON u.id = p.user_id
        WHERE
            u.id = ?;
    `;

    let userTrainingData; 

    try {
        userTrainingData = await db.all(trainingDataQuery, userId );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Could not fetch training data" });
    };

    const userData = userTrainingData[0]; 

    if (userData.bench_press_kg === null && userData.squat_kg === null) {
        return res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    };

    res.send({ data: userData, success: true }); 
}); 

router.get("/users/friends", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const friendRelationshipType = "FRIENDS";

    const friendsIds = await db.all(`SELECT user2_id FROM user_relationships WHERE relationships_type = ?`, friendRelationshipType);

    const friends = await db.all(`SELECT name FROM  `)

})

export default router;