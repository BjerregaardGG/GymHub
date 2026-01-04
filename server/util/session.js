import session from 'express-session';

// generates a session
export const sessionConfig = {
    secret: process.env.SESSION_SECRET, // sign session cookie
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false } // http vs https
};

export default session(sessionConfig);