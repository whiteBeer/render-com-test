// Required Libraries
const express = require('express');
const jwt = require('jsonwebtoken');

// Create Express App
const app = express();

// Secret Key for JWT Signing
const secretKey = 'your-secret-key';

// Mock User Database
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// Route to Authenticate User and Generate JWT
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(el => el.username === username && el.password === password);

    if (user) {
        // Generate JWT with user ID
        const token = jwt.sign({ userId: user.id }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to Authenticate Requests
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'Hello world!!!' });
});

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});