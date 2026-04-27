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

// Public intro page
router.get("/", pages.getIntroPage);
router.get("/intro", pages.getIntroPage);

// Member auth
router.get("/member/login", pages.memberLogin);
router.post("/member/login", pages.postMemberLogin);
router.get("/member/book", requireMember, pages.memberBook);
router.get("/member/confirmation", requireMember, pages.memberConfirmation);
router.get("/member/requests", requireMember, pages.memberRequests);
router.get("/member/profile", requireMember, pages.myProfile);
router.post("/member/requests/:id/return", requireMember, pages.memberReturnRequest);
router.post("/requests", requireMember, pages.submitBorrowRequest);
router.get("/member/register", pages.memberRegister);
router.post("/member/register", pages.postMemberRegister);

// Coordinator auth
router.get("/coordinator/login", pages.coordinatorLogin);
router.post("/coordinator/login", pages.postCoordinatorLogin);
router.get("/coordinator/approve", requireCoordinator, pages.coordinatorApprove);
router.get("/coordinator/requests/pending", requireCoordinator, pages.coordinatorPending);
router.post("/coordinator/requests/:id/approve", requireCoordinator, pages.approveRequest);
router.post("/coordinator/requests/:id/reject", requireCoordinator, pages.rejectRequest);
router.post("/coordinator/requests/:id/complete-return", requireCoordinator, pages.completeReturn);
router.post("/ratings/add", requireMember, pages.addRating);
router.get("/users", requireCoordinator, pages.usersList);
router.get("/users/:id", requireCoordinator, pages.userProfile);

router.get("/member/forgot-password", pages.getForgotPasswordPage);
router.post("/member/forgot-password", pages.postForgotPassword);

router.get("/member/reset-password/:token", pages.getResetPasswordPage);
router.post("/member/reset-password/:token", pages.postResetPassword);

// Coordinator can rate a member for a borrow request
router.post("/coordinator/requests/:id/rate", requireCoordinator, pages.coordinatorRateMember);

// Request messaging
router.get("/member/requests/:id/messages", requireMember, pages.memberRequestMessages);
router.post("/member/requests/:id/messages", requireMember, pages.postMemberRequestMessage);

router.get("/coordinator/requests/:id/messages", requireCoordinator, pages.coordinatorRequestMessages);
router.post("/coordinator/requests/:id/messages", requireCoordinator, pages.postCoordinatorRequestMessage); 

// Logout
router.get("/logout", pages.logout);

// Public pages
router.get("/listings", pages.kitsList);
router.get("/listings/:id", pages.kitDetail);
router.get("/tags", pages.tagsAndCategories);
router.get("/find-campsites", pages.findCampsites);

router.get("/db_test", pages.dbTest);
router.get("/goodbye", pages.goodbye);
router.get("/hello/:name", pages.hello);

module.exports = router;