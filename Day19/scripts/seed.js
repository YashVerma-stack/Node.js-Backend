
import pool from "../config/db.js";

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Reset only the Day 19 development table
    await client.query(`
      TRUNCATE TABLE day19_tasks RESTART IDENTITY;
    `);

    // Insert deterministic sample records
    await client.query(
      `INSERT INTO day19_tasks (title, completed)
       VALUES
         ($1, $2),
         ($3, $4),
         ($5, $6)`,
      [
        "Learn PostgreSQL migrations",
        false,
        "Create deterministic seed scripts",
        false,
        "Verify database records",
        true,
      ]
    );

    await client.query("COMMIT");

    console.log("Database seeding completed successfully.");

    const result = await client.query(`
      SELECT id, title, completed, created_at
      FROM day19_tasks
      ORDER BY id ASC;
    `);

    console.table(result.rows);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
