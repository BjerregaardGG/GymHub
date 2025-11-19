import {Router} from 'express';
import { isAuthorized, isAdmin } from '../middleware/authMiddleware.js';
import { hashPassword } from '../util/encryption.js';
const router = Router();

export const users = [
    { 
        id: 1, 
        name: "Ole", 
        email: "ole@hotmail.dk", 
        // Original adgangskode: 1234x
        password: "$2b$14$qnv9DIMDRErunkw72ZyfuODc./adnNdzyzdNlSCqVv31GfdMZdJZu", 
        role: "admin",
        pr_data: {} 
    },
    { 
        id: 2, 
        name: "Nanna", 
        email: "nanna@hotmail.dk", 
        // Original adgangskode: 4444kl
        password: "$2b$14$vkrt4LlZ0P/JihmaDkAuFukK9C8ODszphqlUjD2y1dic/x3jAmbty", 
        role: "user",
        pr_data: {
            bench_press_kg: 55,     
            squat_kg: 95,           
            deadlift_kg: 110,       
            run_5k_min: 28.5,       
            pull_ups_max: 7         
        }
    },
    { 
        id: 3, 
        name: "Thomas", 
        email: "thomas@gmail.com", 
        // Original adgangskode: 8765ff
        password: "$2b$14$AMBDYttPuznUnZ4biOqV8eUQCxhkXw8F.8QB5n91Ho6PUfGFeWroK", 
        role: "user",
        pr_data: {
            bench_press_kg: 90,     
            squat_kg: 140,          
            deadlift_kg: 175,       
            run_5k_min: 23.0,       
            pull_ups_max: 15        
        }
    },
    { 
        id: 4, 
        name: "Phillip", 
        email: "phillip@gmail.com", 
        // Original adgangskode: password
        password: "$2b$14$8KOIN.ZsiKUVDxnRolNCYeh7nmAHp3NzQnRNadhCZhq.fltxBgpAy", 
        role: "user",
        pr_data: {
            bench_press_kg: 75,     
            squat_kg: 110,          
            deadlift_kg: 140,       
            run_5k_min: 35.1,       
            pull_ups_max: 10        
        }
    },
    { 
        id: 5, 
        name: "Olivia", 
        email: "olivia@gmail.com", 
        // Original adgangskode: youwillneverguess
        password: "$2b$14$IU5LDgyyivGhKO0sX5Z2/.BR9.CdoJmyVgIHKotl3jvIiD7eiM1Nq", 
        role: "admin",
        pr_data: {} 
    }
];


router.get("/users", isAuthorized, isAdmin, (req, res) => {
    const safeUserData = users.map(user => {
        return {
            id: user.id,
            name: user.name,
            role: user.role
        }
    });

    res.send({ data: safeUserData, success: true});
});

router.get("/usertrainingdata", isAuthorized, (req, res) => {    
    const userEmail = req.session.user.email; 

    if (!userEmail) {
        return res.status(401).send({ success: false, message: "Not authorized. You need to login"})
    }

    const user = users.find(user => user.email.toLowerCase() === userEmail.toLowerCase());

    if (!user) {
        return res.status(404).send({ success: false, message: "Could not find user." })
    }

    const userTrainingData = user.pr_data;

    if (!userTrainingData) {
        res.send({ data: {}, success: true, message: "User found, but no training data to show" });
    }

    res.send({ data: userTrainingData, success: true }); 

})

export default router;