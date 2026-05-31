import React from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import Select from "../../atoms/select/Select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import "./StackedAreaWidget.css";

const StackedAreaWidget = ({
  title,
  data,
  areas = [],
  xKey = "name",
  height = 300,
  selectOptions = [],
  selectValue,
  onSelectChange,
  selectPlaceholder = "Filtrer",
}) => {
  const chartHeight = Math.max(height - 64, 180);

  return (
    <Card title={title} className="stacked-area-widget" style={{ marginBottom: "20px" }}>
      {selectOptions.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Select
            value={selectValue}
            onChange={onSelectChange}
            options={selectOptions}
            placeholder={selectPlaceholder}
            style={{ width: 280 }}
          />
        </div>
      ) : null}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {areas.map((a) => (
            <Area
              key={a.key}
              type="monotone"
              dataKey={a.key}
              stackId="1"
              stroke={a.color}
              fill={a.color}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

StackedAreaWidget.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  areas: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, color: PropTypes.string })
  ),
  xKey: PropTypes.string,
  height: PropTypes.number,
  selectOptions: PropTypes.array,
  selectValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectChange: PropTypes.func,
  selectPlaceholder: PropTypes.string,
};

export default StackedAreaWidget;
