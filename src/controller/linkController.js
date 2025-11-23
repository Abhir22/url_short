import service from "../services/linkService.js";
import ApiResponse from "../utils/apiResponse.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LinkController {
  async create(req, res) {
    try {
      const result = await service.createLink(req.body);
      return ApiResponse.success(res, result[0], "Link created");
    } catch (err) {
      return ApiResponse.error(res, err.message, 400);
    }
  }

  async getAll(req, res) {
    try {
      const links = await service.getAll();
      return ApiResponse.success(res, links, "Links fetched");
    } catch (err) {
      return ApiResponse.error(res, err.message, 500);
    }
  }

  async getOne(req, res) {
    try {
      const link = await service.getLink(req.params.shortCode);
      return ApiResponse.success(res, link, "Link fetched");
    } catch (error) {
      return ApiResponse.error(res, error.message, 404);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await service.deleteLink(req.params.shortCode);
      return ApiResponse.success(res, deleted, "Link deleted");
    } catch (err) {
      return ApiResponse.error(res, err.message, 404);
    }
  }

  async redirect(req, res) {
    try {
      const shortCode = req.params.shortCode;

      await service.registerClick(shortCode);
      const link = await service.getLink(shortCode);

      return res.redirect(302, link.original_url);
    } catch (err) {
      // Return 404 HTML page instead of JSON for invalid/deleted links
      return res.status(404).sendFile(
        path.join(__dirname, "../../public/404.html")
      );
    }
  }
}

export default new LinkController();
