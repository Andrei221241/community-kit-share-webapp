const db = require("../app/services/db");
const bcrypt = require("bcryptjs");
const { addPoints, getBadge, getAverageRating } = require("./trust.controller");
const crypto = require("crypto");

const getForgotPasswordPage = (req, res) => {
    res.render("pages/member-forgot-password", {
        title: "Forgot Password",
        error: null,
        success: null,
        resetLink: null,
    });
};

const memberRegister = (req, res) => {
    if (req.session.userId) {
        return res.redirect("/listings");
    }

    res.render("pages/Member-Register-Page", {
        title: "Create Account",
        error: null,
        success: null,
    });
};

const postMemberRegister = withErrorBoundary(async (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const confirmPassword = req.body.confirm_password || "";

    if (!name || !email || !password || !confirmPassword) {
        return res.render("pages/Member-Register-Page", {
            title: "Create Account",
            error: "All fields are required.",
            success: null,
        });
    }

    if (password !== confirmPassword) {
        return res.render("pages/Member-Register-Page", {
            title: "Create Account",
            error: "Passwords do not match.",
            success: null,
        });
    }

    if (password.length < 6) {
        return res.render("pages/Member-Register-Page", {
            title: "Create Account",
            error: "Password must be at least 6 characters long.",
            success: null,
        });
    }

    const [existingUsers] = await db.query(
        `SELECT id FROM users WHERE email = ? LIMIT 1`,
        [email]
    );

    if (existingUsers.length > 0) {
        return res.render("pages/Member-Register-Page", {
            title: "Create Account",
            error: "An account with that email already exists.",
            success: null,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        `INSERT INTO users (name, email, role, password_hash, bio, loyalty_points)
         VALUES (?, ?, 'Member', ?, NULL, 0)`,
        [name, email, hashedPassword]
    );

    res.render("pages/Member-Register-Page", {
        title: "Create Account",
        error: null,
        success: "Account created successfully. You can now log in.",
    });
});

function normaliseRequestStatus(req) {
    const today = new Date();
    const end = new Date(req.end_date);
    const returnedAt = req.returned_at ? new Date(req.returned_at) : null;

    let displayStatus = req.status;
    let overdueDays = 0;
    let canReturn = false;

    if (req.status === "Returned") {
        displayStatus = "Returned";
    } else if (req.status === "Rejected") {
        displayStatus = "Rejected";
    } else if (req.status === "Pending") {
        displayStatus = "Pending";
    } else if (req.status === "Approved") {
        canReturn = true;

        if (today > end) {
            overdueDays = Math.floor((today - end) / (1000 * 60 * 60 * 24));
            displayStatus = overdueDays > 0 ? "Overdue" : "Currently Borrowed";
        } else {
            displayStatus = "Currently Borrowed";
        }
    }

    return {
        ...req,
        returned_at: returnedAt,
        displayStatus,
        overdueDays,
        canReturn,
    };
}

const postForgotPassword = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim();

    if (!email) {
        return res.render("pages/member-forgot-password", {
            title: "Forgot Password",
            error: "Enter your email.",
            success: null,
            resetLink: null,
        });
    }

    const [rows] = await db.query(
        "SELECT id, email FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (!rows.length) {
        return res.render("pages/member-forgot-password", {
            title: "Forgot Password",
            error: null,
            success: "If an account exists, a reset link was generated.",
            resetLink: null,
        });
    }

    const user = rows[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
        `UPDATE users 
         SET reset_token = ?, reset_token_expires = ? 
         WHERE id = ?`,
        [resetToken, expiry, user.id]
    );

    const link = `/member/reset-password/${resetToken}`;

    console.log("==== RESET LINK ====");
    console.log(`http://localhost:3000${link}`);
    console.log("====================");

    res.render("pages/member-forgot-password", {
        title: "Forgot Password",
        error: null,
        success: "Reset link generated. Click the button below.",
        resetLink: link,
    });
});

const getResetPasswordPage = withErrorBoundary(async (req, res) => {
    const token = req.params.token;

    const [rows] = await db.query(
        `SELECT id FROM users 
         WHERE reset_token = ? 
         AND reset_token_expires > NOW()`,
        [token]
    );

    if (!rows.length) {
        return res.render("pages/member-reset-password", {
            title: "Reset Password",
            token: null,
            error: "Invalid or expired link.",
            success: null,
        });
    }

    res.render("pages/member-reset-password", {
        title: "Reset Password",
        token,
        error: null,
        success: null,
    });
});

const postResetPassword = withErrorBoundary(async (req, res) => {
    const token = req.params.token;
    const { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
        return res.render("pages/member-reset-password", {
            title: "Reset Password",
            token,
            error: "Fill all fields.",
            success: null,
        });
    }

    if (password !== confirm_password) {
        return res.render("pages/member-reset-password", {
            title: "Reset Password",
            token,
            error: "Passwords do not match.",
            success: null,
        });
    }

    const [rows] = await db.query(
        `SELECT id FROM users 
         WHERE reset_token = ? 
         AND reset_token_expires > NOW()`,
        [token]
    );

    if (!rows.length) {
        return res.render("pages/member-reset-password", {
            title: "Reset Password",
            token: null,
            error: "Invalid or expired link.",
            success: null,
        });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
        `UPDATE users 
         SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL 
         WHERE id = ?`,
        [hashed, rows[0].id]
    );

    res.render("pages/member-reset-password", {
        title: "Reset Password",
        token: null,
        error: null,
        success: "Password updated. You can login now.",
    });
});

function asNumber(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

function toIsoDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString().slice(0, 10);
}

function withErrorBoundary(handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error(error);
            res.status(500).render("pages/error", {
                title: "Application Error",
                message: "Database query failed. Ask Karim to verify the schema/data for this sprint.",
                details: error.message,
            });
        }
    };
}

// GET / and GET /intro
const getIntroPage = (req, res) => {
    res.render("pages/Intro-Page", { title: "Community Kit Share" });
};

// GET /find-campsites
const findCampsites = (req, res) => {
    res.render("pages/find-campsites-page", { title: "Find Campsites" });
};

const memberLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect("/listings");
    }
    res.render("pages/Member-Login-Page", { title: "Member Login", error: null });
};

const postMemberLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
        return res.render("pages/Member-Login-Page", {
            title: "Member Login",
            error: "Email and password are required."
        });
    }

    const [rows] = await db.query(
        `SELECT id, name, role, password_hash
         FROM users
         WHERE email = ?`,
        [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/Member-Login-Page", {
            title: "Member Login",
            error: "Invalid email or password."
        });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    if (user.role === "Coordinator") {
        return res.redirect("/coordinator/requests/pending");
    }

    res.redirect("/listings");
});

const memberBook = withErrorBoundary(async (req, res) => {
    res.redirect("/listings");
});

const memberConfirmation = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.query.requestId);
    let requestRow = null;

    if (requestId) {
        const [rows] = await db.query(
            `SELECT br.id, br.start_date, br.end_date, br.status, br.note,
                    k.name AS kit_name,
                    u.name AS user_name
             FROM borrow_requests br
             INNER JOIN kits k ON k.id = br.kit_id
             INNER JOIN users u ON u.id = br.user_id
             WHERE br.id = ?`,
            [requestId]
        );
        requestRow = rows[0] || null;
    }

    res.render("pages/Member-Confirmation-Page", {
        title: "Request Confirmation",
        request: requestRow,
    });
});

const coordinatorLogin = (req, res) => {
    if (req.session.userId && req.session.userRole === "Coordinator") {
        return res.redirect("/coordinator/requests/pending");
    }
    res.render("pages/Coordinator-login-Page", { title: "Coordinator Login", error: null });
};

const postCoordinatorLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
        return res.render("pages/Coordinator-login-Page", {
            title: "Coordinator Login",
            error: "Email and password are required."
        });
    }

    const [rows] = await db.query(
        `SELECT id, name, role, password_hash
         FROM users
         WHERE email = ? AND role = 'Coordinator'`,
        [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/Coordinator-login-Page", {
            title: "Coordinator Login",
            error: "Invalid credentials or not a coordinator account."
        });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    res.redirect("/coordinator/requests/pending");
});

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/member/login");
    });
};

const coordinatorApprove = withErrorBoundary(async (req, res) => {
    res.redirect("/coordinator/requests/pending");
});

const usersList = withErrorBoundary(async (req, res) => {
    const [users] = await db.query(
        `SELECT id, name, role, email
         FROM users
         ORDER BY name ASC`
    );

    res.render("pages/users-list", {
        title: "Users List",
        users,
    });
});

const userProfile = withErrorBoundary(async (req, res) => {
    const userId = asNumber(req.params.id);
    if (!userId) {
        res.status(400).render("pages/error", {
            title: "Invalid User",
            message: "A valid user id is required.",
            details: null,
        });
        return;
    }

    const [users] = await db.query(
        `SELECT id, name, email, role, bio, loyalty_points
         FROM users
         WHERE id = ?`,
        [userId]
    );

    const user = users[0];
    if (!user) {
        res.status(404).render("pages/error", {
            title: "User Not Found",
            message: "No user exists for the provided id.",
            details: null,
        });
        return;
    }

    const [requestsRaw] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.status, br.returned_at, br.rejection_reason,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.user_id = ?
         ORDER BY br.created_at DESC`,
        [userId]
    );

    const requests = requestsRaw.map(normaliseRequestStatus);

    const [history] = await db.query(
        `SELECT action_type, points_change, created_at
         FROM points_history
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    const [reviews] = await db.query(
        `SELECT r.stars, r.comment, r.created_at,
                u.name AS reviewer_name
         FROM ratings r
         INNER JOIN users u ON u.id = r.reviewer_user_id
         WHERE r.rated_user_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
    );

    const ratingData = await getAverageRating(db, userId);
    const badge = getBadge(user.loyalty_points || 0);

    res.render("pages/user-profile", {
        title: "User Profile",
        user,
        requests,
        history,
        reviews,
        badge,
        averageRating: ratingData.average_rating,
        totalRatings: ratingData.total_ratings,
        isCoordinatorView: true,
        canManageReturns: true,
        currentUserId: req.session.userId,
    });
});

const myProfile = withErrorBoundary(async (req, res) => {
    const userId = req.session.userId;

    const [users] = await db.query(
        `SELECT id, name, email, role, bio, loyalty_points
         FROM users
         WHERE id = ?`,
        [userId]
    );

    const user = users[0];
    if (!user) {
        res.status(404).render("pages/error", {
            title: "User Not Found",
            message: "No user exists for the logged in session.",
            details: null,
        });
        return;
    }

    const [requestsRaw] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.status, br.returned_at, br.rejection_reason,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.user_id = ?
         ORDER BY br.created_at DESC`,
        [userId]
    );

    const requests = requestsRaw.map(normaliseRequestStatus);

    const [history] = await db.query(
        `SELECT action_type, points_change, created_at
         FROM points_history
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    const [reviews] = await db.query(
        `SELECT r.stars, r.comment, r.created_at,
                u.name AS reviewer_name
         FROM ratings r
         INNER JOIN users u ON u.id = r.reviewer_user_id
         WHERE r.rated_user_id = ?
         ORDER BY r.created_at DESC`,
        [userId]
    );

    const ratingData = await getAverageRating(db, userId);
    const badge = getBadge(user.loyalty_points || 0);

    res.render("pages/user-profile", {
        title: "My Profile",
        user,
        requests,
        history,
        reviews,
        badge,
        averageRating: ratingData.average_rating,
        totalRatings: ratingData.total_ratings,
        isCoordinatorView: false,
        canManageReturns: true,
        currentUserId: req.session.userId,
    });
});

const kitsList = withErrorBoundary(async (req, res) => {
    const category = req.query.category || "";
    const tag = req.query.tag || "";
    const search = req.query.search || "";

    const conditions = [];
    const params = [];

    if (category) {
        conditions.push("c.name = ?");
        params.push(category);
    }

    if (tag) {
        conditions.push("t.name = ?");
        params.push(tag);
    }

    if (search) {
        conditions.push("(k.name LIKE ? OR k.short_description LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [kits] = await db.query(
        `SELECT DISTINCT k.id, k.name,
                c.name AS category,
                k.short_description,
                k.availability_status
         FROM kits k
         LEFT JOIN categories c ON c.id = k.category_id
         LEFT JOIN kit_tags kt ON kt.kit_id = k.id
         LEFT JOIN tags t ON t.id = kt.tag_id
         ${whereClause}
         ORDER BY k.name ASC`,
        params
    );

    const [categories] = await db.query(`SELECT name FROM categories ORDER BY name ASC`);
    const [tags] = await db.query(`SELECT name FROM tags ORDER BY name ASC`);

    res.render("pages/listings", {
        title: "Kits Listing",
        kits,
        categories,
        tags,
        selected: { category, tag, search },
    });
});

const kitDetail = withErrorBoundary(async (req, res) => {
    const kitId = asNumber(req.params.id);
    if (!kitId) {
        res.status(400).render("pages/error", {
            title: "Invalid Listing",
            message: "A valid listing id is required.",
            details: null,
        });
        return;
    }

    const [kits] = await db.query(
        `SELECT k.id, k.name, k.description, k.availability_status,
                c.name AS category
         FROM kits k
         LEFT JOIN categories c ON c.id = k.category_id
         WHERE k.id = ?`,
        [kitId]
    );

    const kit = kits[0];
    if (!kit) {
        res.status(404).render("pages/error", {
            title: "Listing Not Found",
            message: "No listing exists for the provided id.",
            details: null,
        });
        return;
    }

    const [items] = await db.query(
        `SELECT item_name, quantity
         FROM kit_items
         WHERE kit_id = ?
         ORDER BY item_name ASC`,
        [kitId]
    );

    const [tags] = await db.query(
        `SELECT t.name
         FROM tags t
         INNER JOIN kit_tags kt ON kt.tag_id = t.id
         WHERE kt.kit_id = ?
         ORDER BY t.name ASC`,
        [kitId]
    );

    res.render("pages/detail", {
        title: `Kit Detail: ${kit.name}`,
        kit,
        items,
        tags,
        currentUserId: req.session.userId || null,
    });
});

const tagsAndCategories = withErrorBoundary(async (req, res) => {
    const [categories] = await db.query(`SELECT id, name FROM categories ORDER BY name ASC`);
    const [tags] = await db.query(`SELECT id, name FROM tags ORDER BY name ASC`);

    res.render("pages/tags-categories", {
        title: "Tags & Categories",
        categories,
        tags,
    });
});

const submitBorrowRequest = withErrorBoundary(async (req, res) => {
    const kitId = asNumber(req.body.kitId);
    const userId = req.session.userId;
    const startDate = toIsoDate(req.body.startDate);
    const endDate = toIsoDate(req.body.endDate);
    const note = (req.body.note || "").trim();

    if (!kitId || !userId || !startDate || !endDate) {
        res.status(400).render("pages/error", {
            title: "Missing Request Data",
            message: "User, kit, start date, and end date are required.",
            details: null,
        });
        return;
    }

    if (endDate < startDate) {
        res.status(400).render("pages/error", {
            title: "Invalid Date Range",
            message: "End date cannot be before start date.",
            details: null,
        });
        return;
    }

    const [result] = await db.query(
        `INSERT INTO borrow_requests (user_id, kit_id, start_date, end_date, note, status)
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [userId, kitId, startDate, endDate, note || null]
    );

    res.redirect(`/member/confirmation?requestId=${result.insertId}`);
});

const memberRequests = withErrorBoundary(async (req, res) => {
    const userId = req.session.userId;

    const [requestsRaw] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.status, br.returned_at, br.rejection_reason,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.user_id = ?
         ORDER BY br.created_at DESC`,
        [userId]
    );

    const requests = requestsRaw.map(normaliseRequestStatus);

    res.render("pages/member-requests", {
        title: "My Requests",
        requests,
        userId,
        userName: req.session.userName,
    });
});

const coordinatorPending = withErrorBoundary(async (req, res) => {
    const [requestsRaw] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.note, br.status, br.returned_at,
                u.name AS requester_name,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN users u ON u.id = br.user_id
         INNER JOIN kits k ON k.id = br.kit_id
         ORDER BY br.created_at DESC`
    );

    const requests = requestsRaw.map(normaliseRequestStatus);

    res.render("pages/Coordinator-Approve-Page", {
        title: "Manage Requests",
        requests,
    });
});

const approveRequest = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    if (!requestId) {
        res.status(400).render("pages/error", {
            title: "Invalid Request",
            message: "A valid request id is required.",
            details: null,
        });
        return;
    }

    const [rows] = await db.query(
        `SELECT id, user_id, kit_id, start_date, end_date
         FROM borrow_requests
         WHERE id = ? AND status = 'Pending'`,
        [requestId]
    );

    const requestRow = rows[0];
    if (!requestRow) {
        res.status(404).render("pages/error", {
            title: "Pending Request Not Found",
            message: "This request is missing or no longer pending.",
            details: null,
        });
        return;
    }

    const [conflicts] = await db.query(
        `SELECT id
         FROM borrow_requests
         WHERE kit_id = ?
           AND status = 'Approved'
           AND NOT (end_date < ? OR start_date > ?)
         LIMIT 1`,
        [requestRow.kit_id, requestRow.start_date, requestRow.end_date]
    );

    if (conflicts.length > 0) {
        res.status(409).render("pages/error", {
            title: "Availability Conflict",
            message: "Cannot approve because this kit has an overlapping approved booking.",
            details: null,
        });
        return;
    }

    await db.query(
        `UPDATE borrow_requests
         SET status = 'Approved'
         WHERE id = ?`,
        [requestId]
    );

    await addPoints(db, requestRow.user_id, 5, "Request Approved", requestId);

    res.redirect("/coordinator/requests/pending");
});

const completeReturn = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);

    if (!requestId) {
        res.status(400).render("pages/error", {
            title: "Invalid Request",
            message: "A valid request id is required.",
            details: null,
        });
        return;
    }

    const [rows] = await db.query(
        `SELECT id, user_id, status
         FROM borrow_requests
         WHERE id = ?`,
        [requestId]
    );

    const requestRow = rows[0];
    if (!requestRow) {
        res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "No request exists for the provided id.",
            details: null,
        });
        return;
    }

    if (requestRow.status !== "Approved") {
        res.status(400).render("pages/error", {
            title: "Invalid Status",
            message: "Only approved requests can be marked as returned.",
            details: null,
        });
        return;
    }

    await db.query(
        `UPDATE borrow_requests
         SET status = 'Returned',
             returned_at = NOW()
         WHERE id = ?`,
        [requestId]
    );

    await addPoints(db, requestRow.user_id, 10, "Completed Return", requestId);

    res.redirect("back");
});

const memberReturnRequest = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const userId = req.session.userId;

    if (!requestId) {
        res.status(400).render("pages/error", {
            title: "Invalid Request",
            message: "A valid request id is required.",
            details: null,
        });
        return;
    }

    const [rows] = await db.query(
        `SELECT id, user_id, status
         FROM borrow_requests
         WHERE id = ? AND user_id = ?`,
        [requestId, userId]
    );

    const requestRow = rows[0];
    if (!requestRow) {
        res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "This request was not found for your account.",
            details: null,
        });
        return;
    }

    if (requestRow.status !== "Approved") {
        res.status(400).render("pages/error", {
            title: "Invalid Status",
            message: "Only currently borrowed kits can be returned.",
            details: null,
        });
        return;
    }

    await db.query(
        `UPDATE borrow_requests
         SET status = 'Returned',
             returned_at = NOW()
         WHERE id = ?`,
        [requestId]
    );

    await addPoints(db, userId, 10, "Completed Return", requestId);

    res.redirect("/member/profile");
});

const addRating = withErrorBoundary(async (req, res) => {
    const ratedUserId = asNumber(req.body.rated_user_id);
    const reviewerUserId = req.session.userId;
    const requestId = asNumber(req.body.request_id);
    const stars = asNumber(req.body.stars);
    const comment = (req.body.comment || "").trim();

    if (!ratedUserId || !reviewerUserId || !requestId || !stars) {
        res.status(400).render("pages/error", {
            title: "Missing Rating Data",
            message: "Rated user, request, and star rating are required.",
            details: null,
        });
        return;
    }

    if (stars < 1 || stars > 5) {
        res.status(400).render("pages/error", {
            title: "Invalid Rating",
            message: "Rating must be between 1 and 5 stars.",
            details: null,
        });
        return;
    }

    const [requestRows] = await db.query(
        `SELECT id, user_id, status
         FROM borrow_requests
         WHERE id = ?`,
        [requestId]
    );

    const requestRow = requestRows[0];
    if (!requestRow) {
        res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "No request exists for the provided id.",
            details: null,
        });
        return;
    }

    if (requestRow.status !== "Returned") {
        res.status(400).render("pages/error", {
            title: "Rating Not Allowed",
            message: "Ratings can only be submitted after a completed return.",
            details: null,
        });
        return;
    }

    const [existing] = await db.query(
        `SELECT id
         FROM ratings
         WHERE request_id = ? AND reviewer_user_id = ?`,
        [requestId, reviewerUserId]
    );

    if (existing.length > 0) {
        res.status(400).render("pages/error", {
            title: "Duplicate Rating",
            message: "You have already rated this request.",
            details: null,
        });
        return;
    }

    await db.query(
        `INSERT INTO ratings (rated_user_id, reviewer_user_id, request_id, stars, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [ratedUserId, reviewerUserId, requestId, stars, comment || null]
    );

    res.redirect(`/users/${ratedUserId}`);
});

const rejectRequest = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const reason = (req.body.reason || "").trim();

    if (!requestId) {
        res.status(400).render("pages/error", {
            title: "Invalid Request",
            message: "A valid request id is required.",
            details: null,
        });
        return;
    }

    await db.query(
        `UPDATE borrow_requests
         SET status = 'Rejected', rejection_reason = ?
         WHERE id = ?`,
        [reason || null, requestId]
    );

    res.redirect("/coordinator/requests/pending");
});

const dbTest = withErrorBoundary(async (req, res) => {
    const [results] = await db.query("SELECT 1");
    res.send(results);
});

function goodbye(req, res) {
    res.send("Goodbye world!");
}

function hello(req, res) {
    res.send("Hello " + req.params.name);
}

// Member: view messages for one borrow request
const memberRequestMessages = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const userId = req.session.userId;

    const [requestRows] = await db.query(
        `
        SELECT br.*, k.name AS kit_name
        FROM borrow_requests br
        JOIN kits k ON br.kit_id = k.id
        WHERE br.id = ? AND br.user_id = ?
        `,
        [requestId, userId]
    );

    if (requestRows.length === 0) {
        return res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "This request could not be found.",
            details: "The request may not belong to your account.",
        });
    }

    const [messages] = await db.query(
        `
        SELECT rm.*, u.name AS sender_name
        FROM request_messages rm
        JOIN users u ON rm.sender_id = u.id
        WHERE rm.request_id = ?
        ORDER BY rm.created_at ASC
        `,
        [requestId]
    );

    res.render("pages/request-messages", {
        title: "Request Messages",
        request: requestRows[0],
        messages,
        userRole: "Member",
    });
});

// Member: send message
const postMemberRequestMessage = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const userId = req.session.userId;
    const message = req.body.message?.trim();

    if (!message) {
        return res.redirect(`/member/requests/${requestId}/messages`);
    }

    await db.query(
        `
        INSERT INTO request_messages (request_id, sender_id, message)
        VALUES (?, ?, ?)
        `,
        [requestId, userId, message]
    );

    res.redirect(`/member/requests/${requestId}/messages`);
});

// Coordinator: view messages for one borrow request
const coordinatorRequestMessages = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);

    const [requestRows] = await db.query(
        `
        SELECT br.*, k.name AS kit_name, u.name AS member_name
        FROM borrow_requests br
        JOIN kits k ON br.kit_id = k.id
        JOIN users u ON br.user_id = u.id
        WHERE br.id = ?
        `,
        [requestId]
    );

    if (requestRows.length === 0) {
        return res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "This request could not be found.",
            details: "The request may have been deleted.",
        });
    }

    const [messages] = await db.query(
        `
        SELECT rm.*, u.name AS sender_name
        FROM request_messages rm
        JOIN users u ON rm.sender_id = u.id
        WHERE rm.request_id = ?
        ORDER BY rm.created_at ASC
        `,
        [requestId]
    );

    res.render("pages/request-messages", {
        title: "Request Messages",
        request: requestRows[0],
        messages,
        userRole: "Coordinator",
    });
});

// Coordinator: send message
const postCoordinatorRequestMessage = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const userId = req.session.userId;
    const message = req.body.message?.trim();

    if (!message) {
        return res.redirect(`/coordinator/requests/${requestId}/messages`);
    }

    await db.query(
        `
        INSERT INTO request_messages (request_id, sender_id, message)
        VALUES (?, ?, ?)
        `,
        [requestId, userId, message]
    );

    res.redirect(`/coordinator/requests/${requestId}/messages`);
});

// Member: submit a review for a kit/product after the request has been returned
const memberReviewKit = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.params.id);
    const userId = req.session.userId;
    const stars = asNumber(req.body.stars);
    const comment = (req.body.comment || "").trim();

    if (!requestId || !stars) {
        return res.status(400).render("pages/error", {
            title: "Missing Review Data",
            message: "Request ID and star rating are required.",
            details: null,
        });
    }

    if (stars < 1 || stars > 5) {
        return res.status(400).render("pages/error", {
            title: "Invalid Rating",
            message: "Rating must be between 1 and 5 stars.",
            details: null,
        });
    }

    // Check that this request belongs to the logged-in member
    const [requestRows] = await db.query(
        `
        SELECT id, user_id, kit_id, status
        FROM borrow_requests
        WHERE id = ? AND user_id = ?
        `,
        [requestId, userId]
    );

    const requestRow = requestRows[0];

    if (!requestRow) {
        return res.status(404).render("pages/error", {
            title: "Request Not Found",
            message: "This request could not be found for your account.",
            details: null,
        });
    }

    // Members can only review kits after they have returned them
    if (requestRow.status !== "Returned") {
        return res.status(400).render("pages/error", {
            title: "Review Not Allowed",
            message: "You can only review a kit after it has been returned.",
            details: null,
        });
    }

    // Prevent duplicate reviews for the same request
    const [existingReviews] = await db.query(
        `
        SELECT id
        FROM kit_reviews
        WHERE request_id = ? AND user_id = ?
        `,
        [requestId, userId]
    );

    if (existingReviews.length > 0) {
        return res.status(400).render("pages/error", {
            title: "Duplicate Review",
            message: "You have already reviewed this kit for this request.",
            details: null,
        });
    }

    // Save the product/kit review
    await db.query(
        `
        INSERT INTO kit_reviews (kit_id, user_id, request_id, stars, comment)
        VALUES (?, ?, ?, ?, ?)
        `,
        [requestRow.kit_id, userId, requestId, stars, comment || null]
    );

    res.redirect("/member/requests");
});

// Coordinator: give loyalty points to a member with a reason/comment
const coordinatorGivePoints = withErrorBoundary(async (req, res) => {
    const memberId = asNumber(req.params.id);
    const coordinatorId = req.session.userId;
    const points = asNumber(req.body.points);
    const comment = (req.body.comment || "").trim();

    if (!memberId || !points) {
        return res.status(400).render("pages/error", {
            title: "Missing Points Data",
            message: "Member and points value are required.",
            details: null,
        });
    }

    if (points < 1 || points > 100) {
        return res.status(400).render("pages/error", {
            title: "Invalid Points",
            message: "Points must be between 1 and 100.",
            details: null,
        });
    }

    // Check the member exists
    const [users] = await db.query(
        `
        SELECT id
        FROM users
        WHERE id = ? AND role = 'Member'
        `,
        [memberId]
    );

    if (!users.length) {
        return res.status(404).render("pages/error", {
            title: "Member Not Found",
            message: "This member could not be found.",
            details: null,
        });
    }

    // Add points to the member's total loyalty points
    await db.query(
        `
        UPDATE users
        SET loyalty_points = loyalty_points + ?
        WHERE id = ?
        `,
        [points, memberId]
    );

    // Store a points history record with coordinator comment
    await db.query(
        `
        INSERT INTO points_history (user_id, action_type, points_change, comment)
        VALUES (?, ?, ?, ?)
        `,
        [memberId, "Coordinator Award", points, comment || null]
    );

    res.redirect(`/users/${memberId}`);
});

module.exports = {
    getIntroPage,
    findCampsites,
    memberLogin,
    postMemberLogin,
    memberBook,
    memberConfirmation,
    coordinatorLogin,
    postCoordinatorLogin,
    coordinatorApprove,
    logout,
    usersList,
    userProfile,
    kitsList,
    kitDetail,
    tagsAndCategories,
    submitBorrowRequest,
    memberRequests,
    coordinatorPending,
    approveRequest,
    rejectRequest,
    completeReturn,
    addRating,
    dbTest,
    goodbye,
    hello,
    getForgotPasswordPage,
    postForgotPassword,
    getResetPasswordPage,
    postResetPassword,
    myProfile,
    memberReturnRequest,
    memberRegister,
    postMemberRegister,
    memberRequestMessages,
    postMemberRequestMessage,
    coordinatorRequestMessages,
    postCoordinatorRequestMessage,
    memberReviewKit,
    coordinatorGivePoints,
};
