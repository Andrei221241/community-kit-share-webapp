"use strict";

const path = require("path");
const app = require("./app/app");

// 🔥 ADD THESE 2 LINES
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, function () {
    console.log("Server running at http://127.0.0.1:3000/");
});