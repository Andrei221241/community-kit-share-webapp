const express = require("express");
const path = require("path");

const routes = require("../routes");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/", routes);

module.exports = app;
