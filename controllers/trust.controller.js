function getBadge(points) {
  if (points >= 50) return "Community Master";
  if (points >= 20) return "Trusted Member";
  return "New Member";
}

async function addPoints(db, userId, points, actionType, requestId = null) {
  await db.query(
    "UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?",
    [points, userId]
  );

  await db.query(
    "INSERT INTO points_history (user_id, request_id, action_type, points_change) VALUES (?, ?, ?, ?)",
    [userId, requestId, actionType, points]
  );
}

async function getAverageRating(db, userId) {
  const [rows] = await db.query(
    `SELECT ROUND(AVG(stars), 1) AS average_rating, COUNT(*) AS total_ratings
     FROM ratings
     WHERE rated_user_id = ?`,
    [userId]
  );

  return rows[0];
}

module.exports = {
  getBadge,
  addPoints,
  getAverageRating
};