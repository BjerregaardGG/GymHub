import { Router } from "express";
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";

const router = Router({ mergeParams: true });

router.get("/", isAuthorized, async (req, res) => {
    const workout_id = parseInt(req.params.id); 

    const comments = await db.all(`
        SELECT c.comment, c.date_recorded, u.name, u.image_path 
        FROM comments c
        JOIN users u ON c.user_id = u.id 
        WHERE c.workout_id = ?;`, workout_id
    );

    res.send({ data: comments, success: true, message: "Fetched all comments"});

});

router.post("/", isAuthorized, async(req, res) => {
    const workoutId = parseInt(req.params.id)
    const userId = req.session.user.id; 
    const { comment } = req.body;

    try {
        const postCommentQuery = `
            INSERT INTO comments
            (workout_id, user_id, comment) 
            VALUES (?, ?, ?)
        `
        await db.run(postCommentQuery, workoutId, userId, comment);
        
        return res.send({ success: true, message: "Comment added" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

router.delete("/", isAuthorized, async (req, res) => {

})

export default router;