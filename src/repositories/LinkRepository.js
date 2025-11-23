import sql from "../config/database.js";

class LinkRepository {
  async createLink(shortCode, originalUrl) {
    return await sql`
      INSERT INTO links (short_code, original_url)
      VALUES (${shortCode}, ${originalUrl})
      RETURNING *
    `;
  }

  async findByShortCode(shortCode) {
    const result = await sql`
      SELECT * FROM links WHERE short_code = ${shortCode}
    `;
    return result[0] || null;
  }

  async findById(id) {
    const result = await sql`
      SELECT * FROM links WHERE id = ${id}
    `;
    return result[0] || null;
  }

  async getAllLinks() {
    return await sql`
      SELECT * FROM links ORDER BY created_at DESC
    `;
  }

  async deleteByShortCode(shortCode) {
    return await sql`
      DELETE FROM links WHERE short_code = ${shortCode}
      RETURNING *
    `;
  }

  async updateClick(shortCode) {
    return await sql`
      UPDATE links
      SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP
      WHERE short_code = ${shortCode}
      RETURNING *
    `;
  }
}

export default new LinkRepository();
