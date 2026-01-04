import {Router} from "express"
import { isAuthorized} from '../middleware/authMiddleware.js';

import db from "../database/connection.js";

export default ({ onlineUsers }) => {
    const router = Router(); 
    
    router.get("/me/following", isAuthorized, async (req, res) => {
        const userId = req.session.user.id; 

        const following = await db.all(`
            SELECT 
                u.id, 
                u.name, 
                u.image_path
            FROM users u
            INNER JOIN follow_requests fr
            ON fr.reciever_id = u.id
            AND fr.sender_id = ? AND fr.status = 'ACCEPTED'`, 
            userId,
        ); 
    
        const followingWithStatus = following.map(user => ({
            ...user,            
            isOnline: !!onlineUsers[user.id] 
        }));

        if (following.length === 0) {
        return res.send({ data: [], success: true, message: "No following users found" });
        }

        res.send({ data: followingWithStatus, success: true, message: "Successfully fetched following users" });
    });

    router.get("/me/followers", isAuthorized, async (req, res) => {
        const userId = req.session.user.id;

        const followers = await db.all(`
            SELECT 
                u.id, 
                u.name, 
                u.image_path
            FROM users u
            INNER JOIN follow_requests fr
            ON fr.sender_id = u.id
            AND fr.reciever_id = ? AND fr.status = 'ACCEPTED'`, 
            userId,
        ); 

        const followersWithStatus = followers.map(user => ({
            ...user,            
            isOnline: !!onlineUsers[user.id] 
        }));

        if (followers.length === 0) {
            return res.send({ data: [], success: true, message: "No followers found" });
        }
    
        res.send({ data: followersWithStatus, success: true, message: "Successfully fetched followers" });
    });

    // if private - we check for requests 
    router.get("/me/requests", isAuthorized, async (req, res) => {
        const userId = req.session.user.id; 
        console.log("Requests for", userId);

        const followRequests = await db.all(`
            SELECT 
            u.id, 
            u.name, 
            u.image_path
            FROM users u
            INNER JOIN follow_requests fr
            ON fr.sender_id = u.id
            WHERE fr.reciever_id = ? AND fr.status = 'PENDING'`, 
            userId
        );

        if (followRequests.length === 0) {
            return res.send({ data: [], success: true, message: "No incoming follow requests"});
        }

        res.send({ data: followRequests, success: true, message: "Successfully fetched requests" });

    });

    router.post("/following/:id", isAuthorized, async (req, res ) => {
        const senderId = req.session.user.id;
        const recieverId = parseInt(req.params.id); 

        if (senderId === recieverId) {
            return res.status(400).send({ success: false, message: "Cannot follow yourself." });
        }

        try {
            // check the private status for user
            const reciever = await db.get(`SELECT is_private FROM users where id = ?`, recieverId); 

            if (!reciever) {
                return res.status(404).send({ success: false, message: "User not found." });
            }

            const existingRelation = await db.get(
                `SELECT status FROM follow_requests WHERE sender_id = ? AND reciever_id = ?`,
                senderId, recieverId
            );

            // check if the relation already exists 
            if (existingRelation) {
                if (existingRelation.status === 'ACCEPTED') {
                    return res.send({ success: true, message: "Already following." });
                } else if (existingRelation.status === 'PENDING') {
                    return res.send({ success: true, message: "Follow request already sent, waiting for acceptance." });
                } else if (existingRelation.status === 'DECLINED') {
                    await db.run(`
                        DELETE FROM follow_requests
                        WHERE sender_id = ? AND reciever_id = ?`
                        , senderId, recieverId);
                }
            };

            let isPrivate = null; 

            if (reciever.is_private === 1 ) {
                isPrivate = true; 
            } else {
                isPrivate = false; 
            }

            const status = isPrivate ? 'PENDING' : 'ACCEPTED'; 

            // create relation based on private status 
            await db.run(`
                INSERT INTO follow_requests 
                (sender_id, reciever_id, status) 
                VALUES 
                (?, ?, ?)`, senderId, recieverId, status);

            const succesMessage = isPrivate ? "Follow request sent" : "You are now following";

            res.send({ success: true, status: status, message: succesMessage });
        
        }catch(error) {
            res.status(500).send({ success: false, message: "Could not process follow request due to server error." });
        }
    });

    router.patch("/requests/:id/accept", isAuthorized, async (req, res) => {
        const revieverId = req.session.user.id;
        const senderId = parseInt(req.params.id); 

        if (!senderId) {
            return res.status(400).send({ success: false, message: "Missing sender ID." });
        }

        try {
            const result = await db.run(`
                UPDATE follow_requests 
                SET status = 'ACCEPTED'
                WHERE sender_id = ? 
                AND reciever_id = ? 
                AND status = 'PENDING'`,
                senderId, revieverId
            );

            if (result.changes === 0) {
                return res.status(404).send({ success: false, message: "No pending request found from this user." });
            }

            res.send({ success: true, message: `Follow request accepted` });
        
        } catch (error) {
            res.status(500).send({ success: false, message: "Internal server error." });
        };

    });

    router.patch("/requests/:id/decline", isAuthorized, async (req, res) => {
        const revieverId = req.session.user.id;
        const senderId = parseInt(req.params.id); 

        if (!senderId) {
            return res.status(400).send({ success: false, message: "Missing sender ID." });
        }

        try {
            const result = await db.run(`
                UPDATE follow_requests 
                SET status = 'DECLINED'
                WHERE sender_id = ? 
                AND reciever_id = ? 
                AND status = 'PENDING'`,
                senderId, revieverId
            );

            if (result.changes === 0) {
                return res.status(404).send({ success: false, message: "No pending request found from this user." });
            }

            res.send({ success: true, message: `Follow request declined` });
        
        } catch (error) {
            res.status(500).send({ success: false, message: "Internal server error." });
        };
    });

    router.delete("/following/:id", isAuthorized, async (req, res) => {
        const senderId = req.session.user.id;
        const recieverId = parseInt(req.params.id); 

        const result = await db.run(`
            DELETE FROM follow_requests
            WHERE sender_id = ?
            AND reciever_id = ?
            AND status = 'ACCEPTED'`
            , senderId, recieverId
        );

        if (result.changes === 0) {
            return res.status(404).send({ success: false, message: "Relation not found or already terminated." });
        }

        res.send({ success: true, message: `You are now unfollowing` });
    });

    router.delete("/me/followers/:id", isAuthorized, async (req, res) => {
        const followerId = parseInt(req.params.id);
        const userId = req.session.user.id; 

        const result = await db.run(`
            DELETE FROM follow_requests
            WHERE sender_id = ?
            AND reciever_id = ?
            AND status = 'ACCEPTED'`, 
            followerId, userId
        );

        if (result.changes === 0) {
            return res.status(404).send({ success: false, message: "Relation not found or already terminated." });
        }

        res.send({ success: true, message: `You removed the follower` });

    })
    
    return router;
}