// Function to determine user badge based on loyalty points
function getBadge(points) {
  // If user has 50 or more points
  if (points >= 50) return "Community Master";

  // If user has 20 or more points
  if (points >= 20) return "Trusted Member";

  // Default badge for new users
  return "New Member";
}

// Function to add loyalty points to a user and record the action
async function addPoints(db, userId, points, actionType, requestId = null) {
  // Update user's total loyalty points in the database
  await db.query(
    "UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?",
    [points, userId]
  );

  // Insert a record into points history table
  await db.query(
    "INSERT INTO points_history (user_id, request_id, action_type, points_change) VALUES (?, ?, ?, ?)",
    [userId, requestId, actionType, points]
  );
}

// Function to calculate average rating and total number of ratings for a user
async function getAverageRating(db, userId) {
  // Query database for average rating and total count
  const [rows] = await db.query(
    `SELECT ROUND(AVG(stars), 1) AS average_rating, COUNT(*) AS total_ratings
     FROM ratings
     WHERE rated_user_id = ?`,
    [userId]
  );

  // Return the first result (average rating and count)
  return rows[0];
}

// Export functions so they can be used in other parts of the application
module.exports = {
  getBadge,
  addPoints,
  getAverageRating
};