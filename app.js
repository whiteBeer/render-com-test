require("dotenv").config();
require("express-async-errors");

const express = require("express");
const jwt = require("jsonwebtoken");

const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const authMiddleware = require("./middleware/auth");
const {UnauthenticatedError, BadRequestError} = require("./errors");

const app = express();

// Mock User Database
const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" }
];

app.use(express.json());

// Route to Authenticate User and Generate JWT
app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = users.find(el => el.username === username && el.password === password);

    if (user) {
        jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "30d"
        }, (err, token) => {
            if (err || !token) {
                //TODO: how to use with throw?
                next(new UnauthenticatedError("Token sign error"));
            }
            res.json({token});
        });
    } else {
        throw new UnauthenticatedError("Invalid credentials");
    }
});

app.get("/", (req, res) => {
    res.json({ message: "Hello world!!!" });
});

// Protected Route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Protected route accessed successfully" });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.listen(8080, () => {
    console.log("Example app listening at http://localhost:8080");
});