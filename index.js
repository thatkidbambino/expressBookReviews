const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];

    console.log('Received token:', token);

    if (!token) {
        console.log("No token provided.");
        return res.status(403).json({ message: "No token provided." });
    }

    jwt.verify(token.split(' ')[1], '12345', (err, decoded) => {
        if (err) {
            console.log("Failed to authenticate token:", err);
            return res.status(500).json({ message: "Failed to authenticate token." });
        }
        req.user = decoded;
        next();
    });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
