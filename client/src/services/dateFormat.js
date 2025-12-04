export function formatDateRange(startIso, endIso) {
  try {
    const start = startIso ? new Date(startIso) : null;
    const end = endIso ? new Date(endIso) : null;
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    if (start && end) {
      const sameDay = start.toDateString() === end.toDateString();
      if (sameDay) {
        return `${start.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric"
        })} · ${start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })} — ${end.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}`;
      }
      return `${start.toLocaleString(undefined, options)} — ${end.toLocaleString(undefined, options)}`;
    }

    if (start) return start.toLocaleString(undefined, options);
    if (end) return end.toLocaleString(undefined, options);
    return "Data indisponível";
  } catch {
    return "Data inválida";
  }
}
