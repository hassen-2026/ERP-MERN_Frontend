import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./HeatmapCalendarWidget.css";

const dateToYMD = (d) => {
  const dt = new Date(d);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

const addDays = (d, days) => {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
};

const formatDateKey = (d) => dateToYMD(d).toISOString().slice(0, 10);

const HeatmapCalendarWidget = ({ title, values = [], days = 90, height = 120 }) => {
  const matrix = useMemo(() => {
    if (!values || values.length === 0) return { weeks: [], max: 0 };

    const map = new Map();
    let max = 0;
    values.forEach((v) => {
      const key = formatDateKey(v.date);
      const n = Number(v.value || 0);
      map.set(key, (map.get(key) || 0) + n);
      if (n > max) max = n;
    });

    const end = dateToYMD(new Date());
    const start = dateToYMD(addDays(end, -days + 1));

    // Build weeks columns where each column is an array of 7 days (Sun-Sat)
    const weeks = [];
    let current = new Date(start);
    // Align to Sunday
    current.setDate(current.getDate() - current.getDay());

    while (current <= end) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const key = formatDateKey(current);
        week.push({ date: new Date(current), value: map.get(key) || 0, key });
        current = addDays(current, 1);
      }
      weeks.push(week);
    }

    return { weeks, max };
  }, [values, days]);

  const getColor = (value, max) => {
    if (!value) return "#ebedf0";
    const ratio = max > 0 ? value / max : 0;
    if (ratio >= 0.9) return "#216e39";
    if (ratio >= 0.6) return "#31a354";
    if (ratio >= 0.3) return "#7bc96f";
    return "#c6e48b";
  };

  return (
    <div className="heatmap-widget" style={{ height }}>
      {title && <div className="hmw-title">{title}</div>}
      <div className="hmw-grid" role="grid">
        {matrix.weeks.map((week, wi) => (
          <div className="hmw-week" key={`w-${wi}`}>
            {week.map((cell) => (
              <div
                key={cell.key}
                className="hmw-cell"
                title={`${cell.key}: ${cell.value}`}
                style={{ backgroundColor: getColor(cell.value, matrix.max) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

HeatmapCalendarWidget.propTypes = {
  title: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.shape({ date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]), value: PropTypes.number })
  ),
  days: PropTypes.number,
  height: PropTypes.number,
};

export default HeatmapCalendarWidget;
