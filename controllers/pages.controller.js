const db = require("../app/services/db");
const bcrypt = require("bcryptjs");
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

const memberLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect("/listings");
    }
    res.render("pages/member-login", { title: "Member Login", error: null });
};

const postMemberLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
        return res.render("pages/member-login", { title: "Member Login", error: "Email and password are required." });
    }

    const rows = await db.query(`SELECT id, name, role, password_hash FROM users WHERE email = ?`, [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/member-login", { title: "Member Login", error: "Invalid email or password." });
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
        const rows = await db.query(
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

const coordinatorLogin = (req, res) => {
    if (req.session.userId && req.session.userRole === "Coordinator") {
        return res.redirect("/coordinator/requests/pending");
    }
    res.render("pages/coordinator-login", { title: "Coordinator Login", error: null });
};

const postCoordinatorLogin = withErrorBoundary(async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
        return res.render("pages/coordinator-login", { title: "Coordinator Login", error: "Email and password are required." });
    }

    const rows = await db.query(`SELECT id, name, role, password_hash FROM users WHERE email = ? AND role = 'Coordinator'`, [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.render("pages/coordinator-login", { title: "Coordinator Login", error: "Invalid credentials or not a coordinator account." });
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
    const users = await db.query(
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

    const users = await db.query(
        `SELECT id, name, email, role, bio
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

    const requests = await db.query(
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

    const kits = await db.query(
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

    const categories = await db.query(`SELECT name FROM categories ORDER BY name ASC`);
    const tags = await db.query(`SELECT name FROM tags ORDER BY name ASC`);

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

    const kits = await db.query(
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

    const items = await db.query(
        `SELECT item_name, quantity
         FROM kit_items
         WHERE kit_id = ?
         ORDER BY item_name ASC`,
        [kitId]
    );

    const tags = await db.query(
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
    const categories = await db.query(`SELECT id, name FROM categories ORDER BY name ASC`);
    const tags = await db.query(`SELECT id, name FROM tags ORDER BY name ASC`);

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

    const result = await db.query(
        `INSERT INTO borrow_requests (user_id, kit_id, start_date, end_date, note, status)
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [userId, kitId, startDate, endDate, note || null]
    );

    res.redirect(`/member/confirmation?requestId=${result.insertId}`);
});

const memberRequests = withErrorBoundary(async (req, res) => {
    const userId = req.session.userId;

    const requests = await db.query(
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

const coordinatorPending = withErrorBoundary(async (req, res) => {
    const requests = await db.query(
        `SELECT br.id, br.start_date, br.end_date, br.note,
                u.name AS requester_name,
                k.name AS kit_name
         FROM borrow_requests br
         INNER JOIN users u ON u.id = br.user_id
         INNER JOIN kits k ON k.id = br.kit_id
         WHERE br.status = 'Pending'
         ORDER BY br.created_at ASC`
    );

    res.render("pages/coordinator-pending", {
        title: "Pending Requests",
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

    const rows = await db.query(
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

    const conflicts = await db.query(
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

    res.redirect("/coordinator/requests/pending");
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
    const results = await db.query("SELECT * FROM test_table");
    res.send(results);
});

function goodbye(req, res) {
    res.send("Goodbye world!");
}

function hello(req, res) {
    res.send("Hello " + req.params.name);
}

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
