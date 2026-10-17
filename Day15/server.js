
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

// try {
//   const result = await pool.query(
//     "SELECT current_database() AS database, NOW() AS server_time"
//   );

//   console.log("PostgreSQL connected successfully!");
//   console.log(result.rows[0]);
// } catch (error) {
//   console.error("Database connection failed:", error.message);
//   process.exitCode = 1;
// } finally {
//   await pool.end();
// }


// try {
//   const result = await pool.query(`
//     SELECT table_name
//     FROM information_schema.tables
//     WHERE table_schema = 'public'
//       AND table_type = 'BASE TABLE'
//     ORDER BY table_name;
//   `);

//   console.log("PostgreSQL connected successfully!");
//   console.log("Database:", process.env.DB_NAME);
//   console.log("Tables found:");

//   console.table(result.rows);
// } catch (error) {
//   console.error("Database query failed:", error.message);
//   process.exitCode = 1;
// } finally {
//   await pool.end();
// }


try {
  const result = await pool.query(`
    SELECT
      u.name AS user_name,
      a.company,
      a.position,
      a.status
    FROM users AS u
    INNER JOIN applications AS a
      ON u.id = a.user_id
    ORDER BY a.id;
  `);

  console.log("Job applications:");
  console.table(result.rows);
} catch (error) {
  console.error("Query failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}