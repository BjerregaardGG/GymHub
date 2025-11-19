import {Router} from 'express';
import { isAuthorized, isAdmin } from '../middleware/authMiddleware.js';
const router = Router();

export const users = [
    { id: 1, name: "Ole", email: "ole@hotmail.dk", password: "1234x", role: "admin" },
    { id: 2, name: "Nanna", email: "nanna@hotmail.dk", password: "4444kl", role: "user" },
    { id: 3, name: "Thomas", email: "thomas@gmail.com", password: "8765ff", role: "user" },
    { id: 4, name: "Phillip", email: "phillip@gmail.com", password: "password", role: "user" },
    { id: 5, name: "Olivia", email: "olivia@gmail.com", password: "youwillneverguess", role: "admin" }
];

router.get("/users", isAuthorized, isAdmin, (req, res) => {
    const userData = users.map(user => {
        return {
            id: user.id,
            name: user.name,
            role: user.role
        }
    })

    res.send({ data: userData, success: true});
});

router.get("/userdata", isAuthorized, (req, res) => {

})

export default router;