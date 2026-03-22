const express = require("express");

const pages = require("../controllers/pages.controller");

const router = express.Router();

function requireMember(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/member/login");
    }
    next();
}

function requireCoordinator(req, res, next) {
    if (!req.session.userId || req.session.userRole !== "Coordinator") {
        return res.redirect("/coordinator/login");
    }
    next();
}

// Member auth
router.get("/", pages.memberLogin);
router.get("/member/login", pages.memberLogin);
router.post("/member/login", pages.postMemberLogin);
router.get("/member/book", requireMember, pages.memberBook);
router.get("/member/confirmation", requireMember, pages.memberConfirmation);
router.get("/member/requests", requireMember, pages.memberRequests);
router.post("/requests", requireMember, pages.submitBorrowRequest);

// Coordinator auth
router.get("/coordinator/login", pages.coordinatorLogin);
router.post("/coordinator/login", pages.postCoordinatorLogin);
router.get("/coordinator/approve", requireCoordinator, pages.coordinatorApprove);
router.get("/coordinator/requests/pending", requireCoordinator, pages.coordinatorPending);
router.post("/coordinator/requests/:id/approve", requireCoordinator, pages.approveRequest);
router.post("/coordinator/requests/:id/reject", requireCoordinator, pages.rejectRequest);

// Logout
router.get("/logout", pages.logout);

// Public pages
router.get("/users", pages.usersList);
router.get("/users/:id", pages.userProfile);
router.get("/listings", pages.kitsList);
router.get("/listings/:id", pages.kitDetail);
router.get("/tags", pages.tagsAndCategories);

router.get("/db_test", pages.dbTest);
router.get("/goodbye", pages.goodbye);
router.get("/hello/:name", pages.hello);

module.exports = router;
