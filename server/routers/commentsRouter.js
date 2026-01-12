import { Router } from "express";
import { isAuthenticated } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";

const router = Router({ mergeParams: true }); // allows req.params.id

router.get("/", isAuthenticated, async (req, res) => {
    const workout_id = parseInt(req.params.id); 

    const comments = await db.all(`
        SELECT c.id, c.comment, c.date_recorded, c.user_id, u.name, u.image_path 
        FROM comments c
        JOIN users u ON c.user_id = u.id 
        WHERE c.workout_id = ?;`, workout_id
    );

    res.send({ data: comments, success: true, message: "Fetched all comments"});

});

router.post("/", isAuthenticated, async(req, res) => {
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
        console.log(error);
        res.status(500).send({ success: false, message: "Database error" });
    }
});

router.delete("/:commentId", isAuthenticated, async (req, res) => {
    const commentId = parseInt(req.params.commentId); 
    const userId = req.session.user.id; 

    try {
        const result = await db.run(`DELETE FROM comments WHERE id=? and user_id=?`, commentId, userId);

        if (result.changes === 0) {
            return res.status(403).send({succes: false, message: "Could not delete comment"}); 
        }

        return res.send({ success: true, message: "Comment deleted" });

    } catch(error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Database error" });
    }

});

export default router;