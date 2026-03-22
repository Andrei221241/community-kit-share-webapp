// Import the database connection pool (promise-based)
const db = require("../app/services/db");

// Import bcryptjs for comparing hashed passwords during login
const bcrypt = require("bcryptjs");

// UTILITY FUNCTIONS

// Safely converts a value to an integer, returns null if invalid
// Used to validate URL parameters like /users/:id and /listings/:id
function asNumber(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

// Converts a date string to ISO format (YYYY-MM-DD)
// Returns null if the date is invalid
// Used to sanitize start and end dates on borrow requests
function toIsoDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString().slice(0, 10);
}

// ERROR BOUNDARY WRAPPER

// Wraps async controller functions in a try/catch
// If any DB query or logic throws an error, it catches it and renders
// a friendly error page instead of crashing the whole app
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

// MEMBER AUTH

// GET /member/login
// Shows the member login page
// If user is already logged in, redirect straight to listings
const memberLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect("/listings");
    }
    res.render("pages/member-login", { title: "Member Login", error: null });
};

// POST /member/login
// Handles member login form submission
// Looks up user by email, compares password hash, creates session
const postMemberLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    // Validate that both fields are filled in
    if (!email || !password) {
        return res.render("pages/member-login", { title: "Member Login", error: "Email and password are required." });
    }

    // Query the DB for a user with this email
    const [rows] = await db.query(`SELECT id, name, role, password_hash FROM users WHERE email = ?`, [email]);
    const user = rows[0];

    // If no user found or password doesn't match the stored hash, show error
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/member-login", { title: "Member Login", error: "Invalid email or password." });
    }

    // Store user info in the session so we know who is logged in
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    // Coordinators go to their dashboard, members go to listings
    if (user.role === "Coordinator") {
        return res.redirect("/coordinator/requests/pending");
    }
    res.redirect("/listings");
});

// GET /member/book
// Redirects to listings page (booking happens from the detail page)
const memberBook = withErrorBoundary(async (req, res) => {
    res.redirect("/listings");
});

// GET /member/confirmation
// Shows confirmation page after a borrow request is submitted
// Fetches the request details from the DB using the requestId query param
const memberConfirmation = withErrorBoundary(async (req, res) => {
    const requestId = asNumber(req.query.requestId);
    let requestRow = null;

    if (requestId) {
        // Join borrow_requests with kits and users to get full details
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

    res.render("pages/member-confirmation", {
        title: "Request Confirmation",
        request: requestRow,
    });
});

// COORDINATOR AUTH

// GET /coordinator/login
// Shows the coordinator login page
// If already logged in as coordinator, redirect to pending requests
const coordinatorLogin = (req, res) => {
    if (req.session.userId && req.session.userRole === "Coordinator") {
        return res.redirect("/coordinator/requests/pending");
    }
    res.render("pages/coordinator-login", { title: "Coordinator Login", error: null });
};

// POST /coordinator/login
// Handles coordinator login - only allows users with role = 'Coordinator'
const postCoordinatorLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
        return res.render("pages/coordinator-login", { title: "Coordinator Login", error: "Email and password are required." });
    }

    // Only fetch users who are coordinators - extra security check
    const [rows] = await db.query(`SELECT id, name, role, password_hash FROM users WHERE email = ? AND role = 'Coordinator'`, [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/coordinator-login", { title: "Coordinator Login", error: "Invalid credentials or not a coordinator account." });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    res.redirect("/coordinator/requests/pending");
});

// GET /logout
// Destroys the session and redirects to login page
const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/member/login");
    });
};

// GET /coordinator/approve
// Redirects to pending requests page
const coordinatorApprove = withErrorBoundary(async (req, res) => {
    res.redirect("/coordinator/requests/pending");
});

// PUBLIC PAGES

// GET /users
// Fetches all users from the DB and renders the users list page
const usersList = withErrorBoundary(async (req, res) => {
    // Destructure result - mysql2 promise pool returns [rows, fields]
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

// GET /users/:id
// Fetches a single user's profile and their borrow request history
const userProfile = withErrorBoundary(async (req, res) => {
    // Validate the id parameter is a valid number
    const userId = asNumber(req.params.id);
    if (!userId) {
        res.status(400).render("pages/error", {
            title: "Invalid User",
            message: "A valid user id is required.",
            details: null,
        });
        return;
    }

    // Fetch the user from the DB
    const [users] = await db.query(
        `SELECT id, name, email, role, bio
         FROM users
         WHERE id = ?`,
        [userId]
    );

    const user = users[0];

    // If no user found with this id, show 404 error
    if (!user) {
        res.status(404).render("pages/error", {
            title: "User Not Found",
            message: "No user exists for the provided id.",
            details: null,
        });
        return;
    }

    // Fetch this user's borrow request history
    const [requests] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.status,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.user_id = ?
         ORDER BY br.created_at DESC`,
        [userId]
    );

    res.render("pages/user-profile", {
        title: "User Profile",
        user,
        requests,
    });
});

// GET /listings
// Fetches all kits with optional filtering by category, tag and search term
const kitsList = withErrorBoundary(async (req, res) => {
    // Get filter values from the URL query string e.g. /listings?category=Camping
    const category = req.query.category || "";
    const tag = req.query.tag || "";
    const search = req.query.search || "";

    // Dynamically build WHERE clause based on which filters are active
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
        // Search across both kit name and short description
        conditions.push("(k.name LIKE ? OR k.short_description LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    // Only add WHERE if there are active filters
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Use DISTINCT to avoid duplicate kits when joining with tags
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

    // Fetch all categories and tags for the filter dropdowns
    const [categories] = await db.query(`SELECT name FROM categories ORDER BY name ASC`);
    const [tags] = await db.query(`SELECT name FROM tags ORDER BY name ASC`);

    res.render("pages/listings", {
        title: "Kits Listing",
        kits,
        categories,
        tags,
        selected: { category, tag, search }, // Pass back selected filters so dropdowns stay selected
    });
});

// GET /listings/:id
// Fetches full details for a single kit including items and tags
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

    // Fetch the kit with its category name
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

    // Fetch the individual items included in this kit
    const [items] = await db.query(
        `SELECT item_name, quantity
         FROM kit_items
         WHERE kit_id = ?
         ORDER BY item_name ASC`,
        [kitId]
    );

    // Fetch tags assigned to this kit
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
        currentUserId: req.session.userId || null, // Pass userId so template can show/hide booking form
    });
});

// GET /tags
// Fetches all categories and tags for the tags/categories page
const tagsAndCategories = withErrorBoundary(async (req, res) => {
    const [categories] = await db.query(`SELECT id, name FROM categories ORDER BY name ASC`);
    const [tags] = await db.query(`SELECT id, name FROM tags ORDER BY name ASC`);

    res.render("pages/tags-categories", {
        title: "Tags & Categories",
        categories,
        tags,
    });
});

// BORROW REQUESTS

// POST /requests
// Handles submission of a new borrow request from the kit detail page
const submitBorrowRequest = withErrorBoundary(async (req, res) => {
    // Get and validate all required fields from the form
    const kitId = asNumber(req.body.kitId);
    const userId = req.session.userId; // Must be logged in
    const startDate = toIsoDate(req.body.startDate);
    const endDate = toIsoDate(req.body.endDate);
    const note = (req.body.note || "").trim();

    // Check all required fields are present
    if (!kitId || !userId || !startDate || !endDate) {
        res.status(400).render("pages/error", {
            title: "Missing Request Data",
            message: "User, kit, start date, and end date are required.",
            details: null,
        });
        return;
    }

    // Validate that end date is not before start date
    if (endDate < startDate) {
        res.status(400).render("pages/error", {
            title: "Invalid Date Range",
            message: "End date cannot be before start date.",
            details: null,
        });
        return;
    }

    // Insert the new borrow request into the DB with status 'Pending'
    const [result] = await db.query(
        `INSERT INTO borrow_requests (user_id, kit_id, start_date, end_date, note, status)
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [userId, kitId, startDate, endDate, note || null]
    );

    // Redirect to confirmation page with the new request id
    res.redirect(`/member/confirmation?requestId=${result.insertId}`);
});

// GET /member/requests
// Shows all borrow requests made by the currently logged in member
const memberRequests = withErrorBoundary(async (req, res) => {
    const userId = req.session.userId;

    const [requests] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.status,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.user_id = ?
         ORDER BY br.created_at DESC`,
        [userId]
    );

    res.render("pages/member-requests", {
        title: "My Requests",
        requests,
        userId,
        userName: req.session.userName,
    });
});

// COORDINATOR PAGES

// GET /coordinator/requests/pending
// Shows all borrow requests with status 'Pending' for the coordinator to action
const coordinatorPending = withErrorBoundary(async (req, res) => {
    const [requests] = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.note,
                u.name AS requester_name,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN users u ON u.id = br.user_id
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.status = 'Pending'
         ORDER BY br.created_at ASC` // Oldest requests first (fair queue)
    );

    res.render("pages/coordinator-pending", {
        title: "Pending Requests",
        requests,
    });
});

// POST /coordinator/requests/:id/approve
// Approves a pending borrow request
// Checks for booking conflicts before approving
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

    // Fetch the request to get kit and date details for conflict checking
    const [rows] = await db.query(
        `SELECT id, kit_id, start_date, end_date
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

    // Check if there's already an approved booking for this kit
    // that overlaps with the requested dates
    const [conflicts] = await db.query(
        `SELECT id
         FROM borrow_requests
         WHERE kit_id = ?
           AND status = 'Approved'
           AND NOT (end_date < ? OR start_date > ?)
         LIMIT 1`,
        [requestRow.kit_id, requestRow.start_date, requestRow.end_date]
    );

    // If there's a conflict, reject the approval
    if (conflicts.length > 0) {
        res.status(409).render("pages/error", {
            title: "Availability Conflict",
            message: "Cannot approve because this kit has an overlapping approved booking.",
            details: null,
        });
        return;
    }

    // No conflicts - update the status to Approved
    await db.query(
        `UPDATE borrow_requests
         SET status = 'Approved'
         WHERE id = ?`,
        [requestId]
    );

    res.redirect("/coordinator/requests/pending");
});

// POST /coordinator/requests/:id/reject
// Rejects a pending borrow request with an optional reason
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

    // Update status to Rejected and store the rejection reason
    await db.query(
        `UPDATE borrow_requests
         SET status = 'Rejected', rejection_reason = ?
         WHERE id = ?`,
        [reason || null, requestId]
    );

    res.redirect("/coordinator/requests/pending");
});

// TEST / UTILITY ROUTES

// GET /db_test - Simple DB test route
const dbTest = withErrorBoundary(async (req, res) => {
    const [results] = await db.query("SELECT 1");
    res.send(results);
});

// GET /goodbye - Simple test route
function goodbye(req, res) {
    res.send("Goodbye world!");
}

// GET /hello/:name - Simple test route
function hello(req, res) {
    res.send("Hello " + req.params.name);
}

// Export all controller functions so they can be used in routes/index.js
module.exports = {
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
    dbTest,
    goodbye,
    hello,
};