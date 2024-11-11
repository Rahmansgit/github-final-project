const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here

const token = req.headers['authorization'];

    // If no token is provided in the request header
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    // Remove the 'Bearer ' prefix if present
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify the token
    jwt.verify(tokenWithoutBearer, 'your_jwt_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // Add the decoded user info to the request object (to be used later in the route)
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
