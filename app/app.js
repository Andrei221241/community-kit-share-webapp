const express = require("express");
const path = require("path");

// Import express-session for managing user login sessions
const session = require("express-session");

// Import all the routes defined in routes/index.js
const routes = require("../routes");

// Create the Express application
const app = express();

// STATIC FILES

// Serve static files (CSS, JS, images) from the 'public' folder
// e.g. /public/main.js is accessible at http://localhost:3000/main.js
app.use(express.static(path.join(__dirname, "..", "public")));

// BODY PARSING MIDDLEWARE

// Parse form submissions (e.g. login forms, booking forms)
// Makes form data available as req.body
app.use(express.urlencoded({ extended: true }));

// Parse JSON request bodies
// Needed if any requests send data as JSON
app.use(express.json());

// SESSION MIDDLEWARE

// Set up session management so users stay logged in between requests
// Sessions are stored server-side, only a session ID is stored in the browser cookie
app.use(session({
    secret: "kit-share-secret-key", // Secret key used to sign the session cookie
    resave: false,                  // Don't save session if nothing changed
    saveUninitialized: false,       // Don't create a session until something is stored
    cookie: { secure: false }       // Set to true in production with HTTPS
}));

// SESSION USER MIDDLEWARE

// Makes the logged in user available in every Pug template as 'sessionUser'
// Without this, the nav bar wouldn't know who is logged in
// Runs on every single request before the route handlers
app.use((req, res, next) => {
    if (req.session.userId) {
        // If user is logged in, pass their details to the template
        res.locals.sessionUser = {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.userRole
        };
    } else {
        // If not logged in, set sessionUser to null
        // The layout.pug uses this to show Login or Logout in the nav
        res.locals.sessionUser = null;
    }
    next(); // Pass control to the next middleware or route handler
});

// ROUTES

// Mount all application routes at the root path
// All routes defined in routes/index.js will be handled here
app.use("/", routes);

// Export the app so index.js can start the server
module.exports = app;