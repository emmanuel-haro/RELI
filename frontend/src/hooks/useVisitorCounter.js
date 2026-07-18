import { useEffect, useState } from "react";

const STORAGE_KEY = "reli_visits";
/** Bump this to wipe stored counts for all browsers. */
const COUNTER_VERSION = 2;

export function useVisitorCounter() {
  const [counts, setCounts] = useState({ today: 0, month: 0, total: 0 });

  useEffect(() => {
    try {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      const monthKey = now.toISOString().slice(0, 7);
      const raw = localStorage.getItem(STORAGE_KEY);
      let data = raw ? JSON.parse(raw) : null;

      // Reset to zero when version changes or data is missing
      if (!data || data.version !== COUNTER_VERSION) {
        data = {
          version: COUNTER_VERSION,
          dayKey: "",
          day: 0,
          monthKey: "",
          month: 0,
          total: 0,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setCounts({ today: 0, month: 0, total: 0 });
        return;
      }

      data.total = (data.total || 0) + 1;
      data.day = data.dayKey === dayKey ? (data.day || 0) + 1 : 1;
      data.dayKey = dayKey;
      data.month = data.monthKey === monthKey ? (data.month || 0) + 1 : 1;
      data.monthKey = monthKey;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setCounts({ today: data.day, month: data.month, total: data.total });
    } catch {
      setCounts({ today: 0, month: 0, total: 0 });
    }
  }, []);

  return counts;
}
