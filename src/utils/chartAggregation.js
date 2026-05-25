const PERIOD_OPTIONS = [
  { label: "Par jour", value: "day" },
  { label: "Par mois", value: "month" },
  { label: "Par année", value: "year" },
];

const MONTH_LABELS = ["Janv", "Fevr", "Mars", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"];

const toNumber = (value) => Number(value || 0);

const getRecordDate = (record, period) => {
  if (period === "day") {
    return new Date(record?.createdAt || record?.date || Date.now());
  }

  if (record?.year && record?.month) {
    return new Date(record.year, record.month - 1, 1);
  }

  return new Date(record?.createdAt || record?.date || Date.now());
};

const formatBucketLabel = (date, period) => {
  if (period === "day") {
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }

  if (period === "month") {
    return `${MONTH_LABELS[date.getMonth()] || date.toLocaleString("fr-FR", { month: "short" })} ${date.getFullYear()}`;
  }

  return `${date.getFullYear()}`;
};

const getBucketKey = (date, period) => {
  if (period === "day") {
    return date.toISOString().slice(0, 10);
  }

  if (period === "month") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  return `${date.getFullYear()}`;
};

const addToBucket = (buckets, date, period, actualAmount, objectiveAmount) => {
  const key = getBucketKey(date, period);

  if (!buckets[key]) {
    buckets[key] = {
      key,
      name: formatBucketLabel(date, period),
      actual: 0,
      objective: 0,
      date,
    };
  }

  buckets[key].actual += actualAmount;
  buckets[key].objective += objectiveAmount;
};

const buildFallbackSeries = (period) => {
  const today = new Date();
  const fallback = [];
  const count = period === "day" ? 14 : period === "year" ? 5 : 12;

  if (period === "day") {
    for (let offset = count - 1; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      fallback.push({ name: formatBucketLabel(date, period), actual: 0, objective: 0 });
    }
    return fallback;
  }

  if (period === "month") {
    for (let offset = count - 1; offset >= 0; offset -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - offset, 1);
      fallback.push({ name: formatBucketLabel(date, period), actual: 0, objective: 0 });
    }
    return fallback;
  }

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(today.getFullYear() - offset, 0, 1);
    fallback.push({ name: formatBucketLabel(date, period), actual: 0, objective: 0 });
  }

  return fallback;
};

export const buildDualLineSeries = ({
  actualRecords = [],
  objectiveRecords = [],
  period = "month",
  actualValueResolver,
  objectiveValueResolver,
  actualKeys = [],
  objectiveKeys = [],
}) => {
  const buckets = {};

  actualRecords.forEach((record) => {
    const date = getRecordDate(record, period);
    const actualValue = actualValueResolver
      ? actualValueResolver(record)
      : actualKeys.reduce((sum, key) => sum + toNumber(record?.[key]), 0);

    addToBucket(buckets, date, period, actualValue, 0);
  });

  objectiveRecords.forEach((record) => {
    const date = getRecordDate(record, period);
    const objectiveValue = objectiveValueResolver
      ? objectiveValueResolver(record)
      : objectiveKeys.reduce((sum, key) => sum + toNumber(record?.[key]), 0);

    addToBucket(buckets, date, period, 0, objectiveValue);
  });

  const sorted = Object.values(buckets).sort((left, right) => left.date - right.date);

  if (sorted.length === 0) {
    return buildFallbackSeries(period);
  }

  return sorted.map(({ name, actual, objective }) => ({
    name,
    actual: Math.round(actual),
    objective: Math.round(objective),
  }));
};

export { PERIOD_OPTIONS };
