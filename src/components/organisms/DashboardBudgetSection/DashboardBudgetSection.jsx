import React from "react";
import { Card, Col, Progress, Row, Tag } from "antd";

function DashboardBudgetSection({
  title = "Budget",
  summaryTitle = "Résumé",
  summaryItems = [],
  progressTitle = "Utilisation",
  progressPercent = 0,
  progressFormat,
  progressStrokeColor,
  progressType = "circle",
  statusTitle = "Status",
  statusColor = "green",
  statusLabel = "OK",
  statusDescription = "",
  className = "",
  cardStyle,
}) {
  return (
    <Card className={className} style={{ marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", ...cardStyle }} title={title}>
      <Row gutter={24}>
        <Col xs={24} sm={12} md={8}>
          <div className="budget-widget-section">
            <h3>{summaryTitle}</h3>
            <div className="budget-amounts">
              {summaryItems.map((item, index) => (
                <div className="amount-item" key={index}>
                  <span className="label">{item.label}:</span>
                  <span className="value" style={item.valueStyle || {}}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="budget-widget-section">
            <h3>{progressTitle}</h3>
            <Progress
              type={progressType}
              percent={Math.min(progressPercent || 0, 100)}
              format={progressFormat}
              strokeColor={progressStrokeColor}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div className="budget-widget-section">
            <h3>{statusTitle}</h3>
            <div className="status-display">
              <Tag color={statusColor}>{statusLabel}</Tag>
              {statusDescription ? (
                <p style={{ marginTop: "12px", fontSize: "12px", color: "#666" }}>{statusDescription}</p>
              ) : null}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default DashboardBudgetSection;