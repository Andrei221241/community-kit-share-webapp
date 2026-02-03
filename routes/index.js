const express = require("express");

const pages = require("../controllers/pages.controller");

const router = express.Router();

router.get("/", pages.memberLogin);
router.get("/member/login", pages.memberLogin);
router.get("/member/book", pages.memberBook);
router.get("/member/confirmation", pages.memberConfirmation);
router.get("/coordinator/login", pages.coordinatorLogin);
router.get("/coordinator/approve", pages.coordinatorApprove);
router.get("/db_test", pages.dbTest);
router.get("/goodbye", pages.goodbye);
router.get("/hello/:name", pages.hello);

module.exports = router;
