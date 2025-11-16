import session from 'express-session';

// generates a session
export const sessionConfig = {
    secret: process.env.SESSION_SECRET, // enkryptering
    resave: false, // hvis intet i routen har ændret sig mht en session, så forsøger den ikke at gemme et nyt session objekt 
    saveUninitialized: true, // hvornår skal der oprettes et session objekt
    cookie: { secure: false } // virker kun hvis applikation kører på https --> så derfor false (kører på http)
};

export default session(sessionConfig);