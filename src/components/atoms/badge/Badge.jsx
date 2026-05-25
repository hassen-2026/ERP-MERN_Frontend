import { Badge as AntBadge } from "antd";
import "./Badge.css";

function Badge(props) {
  const {
    count,
    status,
    color,
    text,
    customClassName,
    offset,
    children,
  } = {
    count: 0,
    status: null,
    color: "blue",
    text: "",
    customClassName: "",
    offset: null,
    children: null,
    ...props,
  };

  const badgeProps = {
    className: `a-badge ${customClassName}`.trim(),
  };

  if (count) {
    badgeProps.count = count;
  } else if (status) {
    badgeProps.status = status;
  } else if (color) {
    badgeProps.color = color;
  }

  if (offset) {
    badgeProps.offset = offset;
  }

  return (
    <AntBadge {...badgeProps}>
      {text && <span className="a-badge__text">{text}</span>}
      {children}
    </AntBadge>
  );
}

export default Badge;
