const jwt = require("jsonwebtoken");

const JWT_SECRET = "YOUR_SECRET_KEY_HERE"; // Use process.env.JWT_SECRET in real apps

const checkJwt = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // Remove "Bearer " prefix
    const cleanToken = token.replace("Bearer ", "");

    try {
        const jwtPayload = jwt.verify(cleanToken, JWT_SECRET);
        res.locals.jwtPayload = jwtPayload;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        const payload = res.locals.jwtPayload;
        if (roles.includes(payload.role)) {
            next();
        } else {
            res.status(403).send("Access Denied: You do not have permission.");
        }
    };
};

module.exports = { checkJwt, checkRole, JWT_SECRET };