import sql from "../config/database.js";

class HealthService {
  async checkSystem() {
    try {
      // lightweight DB ping
      await sql`SELECT 1`;

      return {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        status: "error",
        database: "disconnected",
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default new HealthService();
