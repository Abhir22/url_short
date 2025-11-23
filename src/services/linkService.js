import repo from "../repositories/LinkRepository.js";
import { validateUrlInput } from "../validation/LinkValidation.js";

class LinkService {
  async createLink(data) {
    const { error } = validateUrlInput(data);
    if (error) throw new Error(error);

    let shortCode;

    // Use custom code if provided, otherwise generate random
    if (data.custom_code) {
      shortCode = data.custom_code.trim();
      
      // Check if custom code already exists
      const exists = await repo.findByShortCode(shortCode);
      if (exists) {
        throw new Error("This short code is already taken. Please choose another one.");
      }
    } else {
      // Generate random short code
      shortCode = Math.random().toString(36).substring(2, 8);
      
      // Check if unique (rare collision)
      const exists = await repo.findByShortCode(shortCode);
      if (exists) throw new Error("Something went wrong. Try again.");
    }

    return await repo.createLink(shortCode, data.original_url);
  }

  async getLink(shortCode) {
    if (!shortCode || shortCode.length < 3)
      throw new Error("Invalid short code");

    const link = await repo.findByShortCode(shortCode);
    if (!link) throw new Error("Link not found");

    return link;
  }

  async getAll() {
    return await repo.getAllLinks();
  }

  async deleteLink(shortCode) {
    if (!shortCode) throw new Error("Short code required");

    const deleted = await repo.deleteByShortCode(shortCode);
    if (deleted.length === 0) throw new Error("Link not found");

    return deleted[0];
  }

  async registerClick(shortCode) {
    const link = await repo.updateClick(shortCode);
    if (!link[0]) throw new Error("Invalid short code");
    return link[0];
  }
}

export default new LinkService();
