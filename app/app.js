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

app.use("/", routes);

module.exports = app;