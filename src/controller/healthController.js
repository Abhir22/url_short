import healthService from "../services/healthService.js";
import ApiResponse from "../utils/apiResponse.js";

class HealthController {
  async getHealth(req, res) {
    try {
      const result = await healthService.checkSystem();
      if (result.status === "ok") {
        return ApiResponse.success(res, result, "System Healthy", 200);
      }
      return ApiResponse.error(res, result.message || "System Issue", 500);
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message || "Unexpected system failure",
        500
      );
    }
  }
}

export default new HealthController();
