"use strict";

const path = require("path");
const app = require("./app/app");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, "0.0.0.0", function () {
    console.log("Server running at http://0.0.0.0:3000/");
});