export const formatEventDate = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Singapore"
  }).format(date);
};

export const formatEventDateRange = (
  startIso: string,
  endIso?: string | null
) => {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : null;

  const dateFormatter = new Intl.DateTimeFormat("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Singapore"
  });

  if (!end) {
    return dateFormatter.format(start);
  }

  const startLabel = dateFormatter.format(start);
  const endLabel = dateFormatter.format(end);

  if (startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
};

const formatTimeValue = (value: string) => {
  const [rawHour, rawMinute] = value.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute ?? "0");

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const paddedMinute = String(minute).padStart(2, "0");

  return `${hour12}:${paddedMinute} ${suffix}`;
};

export const formatAdmissionTimeRange = (
  start?: string | null,
  end?: string | null
) => {
  if (!start || !end) {
    return "TBA";
  }
  return `${formatTimeValue(start)} - ${formatTimeValue(end)}`;
};
