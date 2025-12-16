import session from 'express-session';

// generates a session
export const sessionConfig = {
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false } 
};

export default session(sessionConfig);