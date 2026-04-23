// Returns a badge label based on the user's loyalty points
function getBadge(points) {
  // If points are 50 or more, assign highest badge
  if (points >= 50) return "Community Master";
  
  // If points are 20 or more, assign middle badge
  if (points >= 20) return "Trusted Member";
  
  // Otherwise assign default badge
  return "New Member";
}

// Adds loyalty points to a user and records the action in points history
async function addPoints(db, userId, points, actionType, requestId = null) {
  // Update the user's total loyalty points
  await db.query(
    "UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?",
    [points, userId]
  );

  // Insert a record into the points history table
  await db.query(
    "INSERT INTO points_history (user_id, request_id, action_type, points_change) VALUES (?, ?, ?, ?)",
    [userId, requestId, actionType, points]
  );
}

// Gets the average star rating and total number of ratings for a user
async function getAverageRating(db, userId) {
  // Query the ratings table for the user's average rating and rating count
  const [rows] = await db.query(
    `SELECT ROUND(AVG(stars), 1) AS average_rating, COUNT(*) AS total_ratings
     FROM ratings
     WHERE rated_user_id = ?`,
    [userId]
  );

  // Return the first row containing the calculated rating data
  return rows[0];
}

// Export utility functions for use in other files
module.exports = {
  getBadge,
  addPoints,
  getAverageRating
};