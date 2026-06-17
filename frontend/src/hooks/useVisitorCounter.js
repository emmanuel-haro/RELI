import { useEffect, useState } from "react";

export function useVisitorCounter() {
  const [counts, setCounts] = useState({ today: 0, month: 0, total: 0 });

  useEffect(() => {
    try {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      const monthKey = now.toISOString().slice(0, 7);
      const raw = localStorage.getItem("reli_visits");
      const data = raw ? JSON.parse(raw) : { dayKey: "", day: 0, monthKey: "", month: 0, total: 0 };

      data.total = (data.total || 0) + 1;
      data.day = data.dayKey === dayKey ? (data.day || 0) + 1 : 1;
      data.dayKey = dayKey;
      data.month = data.monthKey === monthKey ? (data.month || 0) + 1 : 1;
      data.monthKey = monthKey;

      localStorage.setItem("reli_visits", JSON.stringify(data));
      setCounts({ today: data.day, month: data.month, total: data.total });
    } catch {
      setCounts({ today: 1, month: 1, total: 1 });
    }
  }, []);

  return counts;
}
