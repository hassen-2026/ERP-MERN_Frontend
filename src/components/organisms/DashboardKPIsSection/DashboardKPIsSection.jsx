import React from "react";
import { Row, Col, Card } from "antd";
import "./DashboardKPIsSection.css";

/**
 * DashboardKPIsSection - ORGANISM
 * Encapsulates Row/Col layout for KPI cards
 * Props: kpis (array of { label, value })
 */
function DashboardKPIsSection({ kpis = [], className = "" }) {
  return (
    <div className={`o-dashboard-kpis-section ${className}`.trim()}>
      <Row gutter={[16, 16]}>
        {kpis.map((kpi, index) => (
          <Col key={index} xs={24} md={6}>
            <Card className="o-dashboard-kpis-section__card">
              <div className="o-dashboard-kpis-section__label">{kpi.label}</div>
              <div className="o-dashboard-kpis-section__value">{kpi.value}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default DashboardKPIsSection;
