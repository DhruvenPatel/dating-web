import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "Cannot reach the server. Check your connection.";

    const data = error.response.data;

    if (typeof data?.detail === "string") return data.detail;

    const list = Array.isArray(data?.detail)
      ? data.detail
      : Array.isArray(data?.details)
        ? data.details
        : null;

    if (list?.length) {
      const first = list[0];
      const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : null;
      return field ? `${String(field)}: ${first.msg}` : first.msg;
    }

    if (typeof data?.message === "string") return data.message;
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}