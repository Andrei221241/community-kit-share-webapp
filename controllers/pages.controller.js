const db = require("../app/services/db");

function memberLogin(req, res) {
    res.render("pages/Member-Login-Page");
}

function memberBook(req, res) {
    res.render("pages/Member-Book-Page");
}

function memberConfirmation(req, res) {
    res.render("pages/Member-Confirmation-Page");
}

function coordinatorLogin(req, res) {
    res.render("pages/Coordinator-login-Page");
}

async function coordinatorApprove(req, res) {
    try {
        const sql = "SELECT * FROM requests";
        const requests = await db.query(sql);

        res.render("pages/Coordinator-Approve-Page", {
            requests
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
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