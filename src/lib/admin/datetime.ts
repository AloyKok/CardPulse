const hasTimezone = (value: string) => /Z|[+-]\d{2}:?\d{2}$/.test(value);

const withSeconds = (value: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
    ? `${value}:00`
    : value;

export const parseSgDateTime = (value: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const withTime = withSeconds(trimmed);
  const withZone = hasTimezone(withTime) ? withTime : `${withTime}+08:00`;
  const date = new Date(withZone);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

export const formatSgDateTimeLocal = (iso?: string | null) => {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPart["type"]) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart(
    "hour"
  )}:${getPart("minute")}`;
};

export const formatSgDate = (iso?: string | null) => {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPart["type"]) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
};

export const formatSgTimeValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
};
