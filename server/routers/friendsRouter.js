import {Router} from "express"
import { isAuthorized, isAdmin } from '../middleware/authMiddleware.js';
import db from "../database/connection.js";
const router = Router(); 

router.get("/friends", isAuthorized, async (req, res) => {
    const userId = req.session.user.id; 

    if (!userId) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const friends = await db.all(`
        SELECT 
            u.id, 
            u.name, 
            u.image_path
        FROM users u
        INNER JOIN user_relationships ur
        ON (
            (ur.user2_id = u.id AND ur.user1_id = ?) OR 
            (ur.user1_id = u.id AND ur.user2_id = ?)
        )
        WHERE u.id != ?`, userId, userId, userId); // We dont wanne get ourself 

    if (friends.length === 0) {
        return res.send({ data: [], success: true, message: "No friends found" });
    }

    res.send({ data: friends, success: true, message: "Successfully fetched friends" });
});

export default router; 