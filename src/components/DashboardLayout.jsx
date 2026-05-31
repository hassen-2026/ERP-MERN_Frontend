import React, { useEffect, useState } from "react";
import { Row, Col, Card, Select } from "antd";
import ProjectStatCard from "./molecules/StatCard/StatCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./DashboardLayout.css";

/**
 * Use project StatCard atom for KPI cards
 */

/**
 * Component for displaying a bar chart
 */
export const BarChartWidget = ({
  title,
  data,
  dataKey,
  bars = [],
  xAxis = "name",
  height = 300,
  barColor = "#184f87",
}) => (
  <Card title={title} style={{ marginBottom: "20px" }}>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.length > 0
          ? bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.key}
                name={bar.label || bar.key}
                stackId={bar.stackId}
                fill={bar.color || barColor}
              />
            ))
          : <Bar dataKey={dataKey} fill={barColor} />}
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Component for displaying a line chart
 */
export const LineChartWidget = ({
  title,
  data,
  dataKey,
  lines = [],
  xAxis = "name",
  height = 300,
  selectOptions = [],
  selectValue,
  onSelectChange,
}) => (
  <Card title={title} style={{ marginBottom: "20px" }}>
    {selectOptions.length > 0 ? (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Select value={selectValue} onChange={onSelectChange} options={selectOptions} style={{ width: 160 }} />
      </div>
    ) : null}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.length > 0
          ? lines.map((line, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={line.key}
                name={line.label || line.key}
                stroke={line.color || "#184f87"}
                strokeWidth={2}
              />
            ))
          : <Line type="monotone" dataKey={dataKey} stroke="#184f87" strokeWidth={2} />}
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Component for displaying a multi-line chart
 */
export const MultiLineChartWidget = ({ title, data, lines, xAxis = "name", height = 300 }) => (
  <Card title={title} style={{ marginBottom: "20px" }}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line, idx) => (
          <Line
            key={idx}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

/**
 * Component for displaying a pie chart
 */
export const PieChartWidget = ({
  title,
  data = [],
  dataKey = "value",
  height = 300,
  colors,
  currency = "DT",
  innerRadius = 60,
  outerRadius = 80,
  showCenter = true,
}) => {
  const total = Array.isArray(data) ? data.reduce((s, d) => s + Number(d[dataKey] || 0), 0) : 0;

  const tooltipFormatter = (value) => `${Number(value || 0).toLocaleString()} ${currency}`;

  return (
    <Card title={title} style={{ marginBottom: "20px", position: "relative" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {colors && colors.map((color, index) => <Cell key={`cell-${index}`} fill={color} />)}
          </Pie>
          <Tooltip formatter={tooltipFormatter} />
          {showCenter && (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 14, fontWeight: 700 }}>
              {`${Math.floor(total).toLocaleString()} ${currency}`}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

/**
 * Map widget showing aggregated locations. Expects `locations` array: { location: string, total, count }
 * Uses Nominatim for geocoding city/address to lat/lng and caches results in localStorage under `geo_cache`.
 */
export const MapChartWidget = ({ title, locations = [], height = 400, tileUrl, countLabel = "Documents" }) => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const geoCache = JSON.parse(localStorage.getItem("geo_cache" ) || "{}");

    const geocode = async (q) => {
      if (!q) return null;
      if (geoCache[q]) return geoCache[q];
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
        const res = await fetch(url, { headers: { "User-Agent": "MyApp" } });
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          geoCache[q] = { lat: Number(lat), lng: Number(lon) };
          localStorage.setItem("geo_cache", JSON.stringify(geoCache));
          return geoCache[q];
        }
      } catch (e) {
        // ignore
      }
      return null;
    };

    let mounted = true;
    (async () => {
      const out = [];
      for (const loc of locations) {
        const coord = await geocode(loc.location || loc);
        if (coord) out.push({ ...loc, coord });
      }
      if (mounted) setPoints(out);
    })();

    return () => (mounted = false);
  }, [locations]);

  const tile = tileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <Card title={title} style={{ marginBottom: "20px" }}>
      <div style={{ width: "100%", height }}>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
          <TileLayer url={tile} />
          {points.map((p, idx) => (
            <CircleMarker
              key={idx}
              center={[p.coord.lat, p.coord.lng]}
              radius={Math.max(6, Math.log((p.total || p.count || 1) + 1) * 6)}
              pathOptions={{ color: "#1890ff", fillColor: "#1890ff", fillOpacity: 0.6 }}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>{p.location}</strong>
                  <div>Montant: {Number(p.total || 0).toLocaleString()}</div>
                  <div>{countLabel}: {p.count || 0}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

/**
 * Component for displaying dashboard stats grid
 */
export const DashboardStatsGrid = ({ stats }) => (
  <Row gutter={[16, 16]} style={{ marginBottom: "30px" }}>
    {stats.map((stat, idx) => (
      <Col xs={24} sm={12} md={8} lg={6} key={idx}>
        <ProjectStatCard
          value={stat.value}
          label={stat.title}
          containerClassName="stat-card"
          defaultValueClassName="ant-statistic-content"
          defaultLabelClassName="ant-statistic-title"
          style={{ borderLeftColor: stat.color || "#184f87" }}
        />
      </Col>
    ))}
  </Row>
);

/**
 * Component for displaying dashboard charts in grid
 */
export const DashboardChartsGrid = ({ charts }) => (
  <Row gutter={[16, 16]}>
    {charts.map((chart, idx) => (
      <Col xs={24} md={chart.span || 12} key={idx}>
        {chart.component}
      </Col>
    ))}
  </Row>
);

export default {
  StatCard: ProjectStatCard,
  BarChartWidget,
  LineChartWidget,
  MultiLineChartWidget,
  PieChartWidget,
  MapChartWidget,
  DashboardStatsGrid,
  DashboardChartsGrid,
};
