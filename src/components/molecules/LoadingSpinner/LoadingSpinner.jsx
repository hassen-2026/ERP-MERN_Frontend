import React from "react";
import { Spin } from "antd";
import "./LoadingSpinner.css";

/**
 * LoadingSpinner - MOLECULE (Ant Design Spin wrapped)
 * Encapsulates the Spin component from Ant Design
 * Props: size, tip, delay, fullscreen, customClassName
 */
function LoadingSpinner({
  size = "large",
  tip = "Chargement...",
  delay,
  fullscreen = false,
  customClassName = "",
}) {
  if (fullscreen) {
    return <Spin size={size} tip={tip} delay={delay} fullscreen spinning={true} />;
  }

  return (
    <div className={`m-loading-spinner ${customClassName}`.trim()}>
      <Spin size={size} delay={delay} spinning={true} />
      {tip && <p style={{ marginTop: "12px", textAlign: "center" }}>{tip}</p>}
    </div>
  );
}

export default LoadingSpinner;
