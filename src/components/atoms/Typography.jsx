import React from "react";
import { Typography as AntTypography } from "antd";
import "./Typography.css";

const { Title, Text, Paragraph } = AntTypography;

function Typography({
  variant = "text",
  level = 4,
  type,
  strong = false,
  className = "",
  children
}) {
  const classes = `app-typography ${className}`.trim();

  if (variant === "title") {
    return (
      <Title level={level} className={classes}>
        {children}
      </Title>
    );
  }

  if (variant === "paragraph") {
    return (
      <Paragraph type={type} className={classes}>
        {children}
      </Paragraph>
    );
  }

  return (
    <Text type={type} strong={strong} className={classes}>
      {children}
    </Text>
  );
}

export default Typography;
