import sql from "./database.js";

async function initDatabase() {
  try {

    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        last_clicked TIMESTAMP
      )
    `;
  console.log("✅ Database initialized! Table 'links' is ready.");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

initDatabase()
  .then(() => {
    console.log("Database ready!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
