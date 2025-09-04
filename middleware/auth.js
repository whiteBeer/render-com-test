const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("No token provided");
    } else {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                throw new UnauthenticatedError("Invalid token");
            }
            req.user = user;
            next();
        });
    }
};

module.exports = authenticationMiddleware;
