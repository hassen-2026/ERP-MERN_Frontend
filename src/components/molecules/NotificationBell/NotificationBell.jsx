import { Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./NotificationBell.css";

function NotificationBell({ count = 0 }) {
  return (
    <Link to="/notifications" className="m-notification-bell">
      <Badge count={count} size="small">
        <BellOutlined className="m-notification-bell__icon" />
      </Badge>
    </Link>
  );
}

export default NotificationBell;
