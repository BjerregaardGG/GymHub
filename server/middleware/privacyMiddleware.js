import db from "../database/connection.js";

// We can access data if we follow or they are public 
async function checkAccess(userId, contentUserId) {
    
    if (userId === contentUserId) {
        return { authorized: true };
    }

    // check for privacy status
    const owner = await db.get(`SELECT is_private FROM users WHERE id = ?`, contentUserId); 

    if (!owner) {
        return { authorized: false, status: 404, message: "Content owner not found." };
    }

    // if owner is public...
    if (owner.is_private === 0) {
        return { authorized: true };
    }

    const relation = await db.get(`
        SELECT status 
        FROM follow_requests 
        WHERE sender_id = ? AND reciever_id = ? 
        AND status = 'ACCEPTED'`, 
        userId, contentUserId
    ); 

    if (relation) {
        return { authorized: true };
    }

    return { authorized: false, status: 403, message: "You must be a follower to view this data." };
}; 

export async function canViewContent(req, res, next) {
    const userId = req.session.user.id; 
    const contentUserId = parseInt(req.params.id || req.params.userId); 

    if (!contentUserId) {
        return res.status(400).send({ success: false, message: "Invalid user ID provided." });
    }

    try {
        const result = await checkAccess(userId, contentUserId); 

        if(result.authorized) {
            return next(); 
        } else {
            return res.status(result.status).send({ success: false, message: result.message }); 
        }
    } catch (error) {
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};