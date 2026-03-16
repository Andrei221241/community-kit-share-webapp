const express = require("express");
const path = require("path");
const session = require("express-session");

const routes = require("../routes");

const app = express();

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "community-kit-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
}));

// Expose session user to all Pug templates
app.use((req, res, next) => {
    res.locals.sessionUser = req.session.userId
        ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
        : null;
    next();
});

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/", routes);

module.exports = app;
