const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(`Network error: ${err.message}`);
    }
    throw err;
  }
}

export const api = {
  health: () => request("/health"),
  sendMessage: (body) => request("/messages", { method: "POST", body: JSON.stringify(body) }),
  getPaymentConfig: () => request("/payments/config"),
  // STK Push removed: keep function for backward compatibility but point to /payments/bank
  initiateMpesa: (body) => request("/payments/bank", { method: "POST", body: JSON.stringify(body) }),
  recordBankDonation: (body) => request("/payments/bank", { method: "POST", body: JSON.stringify(body) }),
  getPaymentStatus: (id) => request(`/payments/status/${id}`),
};
