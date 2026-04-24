const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  getItems: (search = "") =>
    req(`/items${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  addItem: (body) =>
    req("/items", { method: "POST", body: JSON.stringify(body) }),
  deleteItem: (id) => req(`/items/${id}`, { method: "DELETE" }),
  addEntry: (itemId, body) =>
    req(`/items/${itemId}/entries`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteEntry: (id) => req(`/entries/${id}`, { method: "DELETE" }),
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v),
    ).toString();
    return req(`/transactions${qs ? "?" + qs : ""}`);
  },
};
