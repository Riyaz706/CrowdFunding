// Central API base URL — set VITE_API_URL in your .env file (dev) or Vercel dashboard (production)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default BASE_URL;
