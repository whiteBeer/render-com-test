require("dotenv").config();
require("express-async-errors");

const express = require("express");
const jwt = require("jsonwebtoken");

const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const authMiddleware = require("./middleware/auth");
const {UnauthenticatedError, BadRequestError} = require("./errors");

const connectDB = require("./db/connect");
const User = require("./models/user");

const app = express();

app.use(express.json());

// Route to Authenticate User and Generate JWT
app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({
        username: username,
        password: password
    });

    if (user && user._id) {
        jwt.sign({userId: user._id.toString()}, process.env.JWT_SECRET, {
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

app.get("/", async (req, res) => {
    const users = await User.find({}).limit(10);
    res.json(users);
});

// Protected Route
app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Protected route accessed successfully" });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    const port = 8080;
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();