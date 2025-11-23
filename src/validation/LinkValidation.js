export function validateUrlInput(data) {
  if (!data || !data.original_url) {
    return { error: "original_url is required" };
  }

  try {
    new URL(data.original_url); 
  } catch (e) {
    return { error: "Invalid URL format" };
  }

  // Validate custom short code if provided
  if (data.custom_code) {
    const code = data.custom_code.trim();
    
    // Check length (3-20 characters)
    if (code.length < 3 || code.length > 20) {
      return { error: "Custom code must be between 3 and 20 characters" };
    }
    
    // Check for valid characters (alphanumeric, dash, underscore only)
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      return { error: "Custom code can only contain letters, numbers, dashes, and underscores" };
    }
    
    // Reserved words that cannot be used as short codes
    const reserved = ['api', 'stats', 'health', 'healthz', 'dashboard', 'admin'];
    if (reserved.includes(code.toLowerCase())) {
      return { error: "This short code is reserved and cannot be used" };
    }
  }

  return { error: null };
}
