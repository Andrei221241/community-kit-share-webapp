const path = require("path");

const db = require("../app/services/db");

const pagesRoot = path.join(__dirname, "..", "views", "pages");

function sendPage(res, fileName) {
    res.sendFile(path.join(pagesRoot, fileName));
}

function memberLogin(req, res) {
    sendPage(res, "Member-Login-Page.html");
}

function memberBook(req, res) {
    sendPage(res, "Member-Book-Page.html");
}

function memberConfirmation(req, res) {
    sendPage(res, "Member-Confirmation-Page.html");
}

function coordinatorLogin(req, res) {
    sendPage(res, "Coordinator-login-Page.html");
}

function coordinatorApprove(req, res) {
    sendPage(res, "Coordinator-Approve-Page.html");
}

function dbTest(req, res) {
    const sql = "select * from test_table";
    db.query(sql).then((results) => {
        console.log(results);
        res.send(results);
    });
}

function goodbye(req, res) {
    res.send("Goodbye world!");
}

function hello(req, res) {
    console.log(req.params);
    res.send("Hello " + req.params.name);
}

module.exports = {
    memberLogin,
    memberBook,
    memberConfirmation,
    coordinatorLogin,
    coordinatorApprove,
    dbTest,
    goodbye,
    hello,
};
