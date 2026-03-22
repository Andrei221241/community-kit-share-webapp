const express = require("express");
const path = require("path");
const session = require("express-session");
const routes = require("../routes");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "kit-share-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Makes sessionUser available in every pug template
app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.sessionUser = {
            id: req.session.userId,
            name: req.session.userName,
            role: req.session.userRole
        };
    } else {
        res.locals.sessionUser = null;
    }
    next();
});

app.use("/", routes);

module.exports = app;