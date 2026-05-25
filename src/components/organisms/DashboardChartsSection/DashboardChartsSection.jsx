import React from "react";
import { Row, Col } from "antd";
import "./DashboardChartsSection.css";

/**
 * DashboardChartsSection - ORGANISM
 * Encapsulates Row/Col layout for dashboard charts
 * Props: charts (array of { component, span })
 */
function DashboardChartsSection({ charts = [], gutter = [16, 16], className = "" }) {
  return (
    <div className={`o-dashboard-charts-section ${className}`.trim()}>
      <Row gutter={gutter}>
        {charts.map((chart, index) => (
          <Col key={index} xs={24} md={chart.span || 12}>
            {chart.component}
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default DashboardChartsSection;
