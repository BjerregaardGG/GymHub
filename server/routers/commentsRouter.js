import { Router } from "express";
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router(); 

router.get("/comments/:workoutid", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 
    const workout_id = req.params.workoutid; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login."});
    }

    const comments = await db.all(`
        SELECT c.comment, c.date_recorded, u.name, u.image_path 
        FROM comments c
        JOIN users u ON c.user_id = u.id 
        WHERE c.workout_id = ?;`, workout_id
    );

    res.send({ data: comments, success: true, message: "Fetched all comments"});

});

router.post("/comments", isAuthorized, async(req, res) => {
    const userId = req.session.user.id; 
    const {comment, workout_id} = req.body;

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login."});
    }

    try {
        const postCommentQuery = `
            INSERT INTO comments
            (workout_id, user_id, comment) 
            VALUES (?, ?, ?)
        `
        await db.run(postCommentQuery, workout_id, userId, comment);
        
        return res.send({ success: true, message: "Comment added" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

export default router;