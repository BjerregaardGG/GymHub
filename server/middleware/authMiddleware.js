export function isAuthorized(req, res, next){
    if (!req.session || !req.session.user) {
        return res.status(401).send({ message: "Not authorized. You need to login"})
    }

    req.user = req.session.user; 
    return next();
}

export function isAdmin(req, res, next) {
    const isAdmin = req.session.user && req.session.user.role == "ADMIN";

    if (!isAdmin) {
        return res.status(403).send({ message: "You do not have access to admin content." });
    }

    return next();
}