import { Router } from 'express';
import { isAuthorized } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";

const router = Router();

router.get("/", isAuthorized, async (req, res) => {

    const userData = await db.all('SELECT id, name, role FROM users');

    res.send({ data: userData, success: true});
});

router.get("/me", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    const userData = await db.get(`SELECT id, name, image_path, is_private FROM users WHERE id = ?;`, userId);

    if (!userData) {
        return res.status(404).send({ success: false, message: "User not found or session data invalid." });
    }

    res.send({ data: userData, success: true});
});

router.get("/:id", isAuthorized, async (req, res) => {
    const userId = req.params.id; 

    const userData = await db.get(`SELECT name, image_path FROM users WHERE id = ?;`, userId);

    if (!userData) {
        return res.status(404).send({ success: false, message: "User not found or session data invalid." });
    }
    res.send({ data: userData, success: true});
})

router.patch("/me/privacy", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

     try {

        const currentUserStatus = await db.get(`
            SELECT is_private 
            FROM users WHERE id = ?`, 
            userId
        );

        if (!currentUserStatus) {
            return res.status(404).send({ success: false, message: "User not found." });
        }

        const newStatus = !currentUserStatus.is_private; 

        const result = await db.run(`
            UPDATE users 
            SET is_private = ?
            WHERE id = ?`, 
            newStatus, userId
        );
    
        if (result.changes === 0) {
            return res.status(404).send({ success: false, message: "No pending request found from this user." });
        }
    
        res.send({ is_private: newStatus, success: true, message: `Changed private status to ${newStatus ? "private" : "public"}` });
            
     } catch (error) {
        res.status(500).send({ success: false, message: "Internal server error." });
    }
});

export default router;