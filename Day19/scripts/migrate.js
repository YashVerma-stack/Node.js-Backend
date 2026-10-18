
import pool from "../config/db.js";

const migrationVersion = "001";
const migrationName = "create_day19_tables";

const migrate = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS day19_migration_history (
        version VARCHAR(20) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS day19_tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(
      `INSERT INTO day19_migration_history (version, name)
       VALUES ($1, $2)
       ON CONFLICT (version) DO NOTHING`,
      [migrationVersion, migrationName]
    );

    await client.query("COMMIT");

    console.log("Database migration completed successfully.");
    console.log("Migration:", migrationVersion, migrationName);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
