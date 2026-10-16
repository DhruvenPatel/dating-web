const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!apiBase) {
  throw new Error("VITE_API_BASE_URL is not set. Add it to your .env file and restart Vite.");
}

export const env = {
  API_BASE_URL: apiBase.replace(/\/$/, ""),
};