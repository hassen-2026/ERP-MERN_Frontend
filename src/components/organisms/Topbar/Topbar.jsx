import { Space, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import NavItem from "../../atoms/navItem/NavItem";
import Avatar from "../../atoms/avatar/Avatar";
import NotificationBell from "../../molecules/NotificationBell/NotificationBell";
import "./Topbar.css";

function Topbar({ menuItems = [] , user = { name: "User" }, unreadCount = 0 }) {
  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <NavLink to="/profile">Profil</NavLink>
      </Menu.Item>
      <Menu.Item key="logout">
        <NavLink to="/logout">Deconnexion</NavLink>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="o-topbar">
      <div className="o-topbar__brand">
        <NavLink to="/" className="o-topbar__brand-link">
          <span className="o-topbar__brand-text">ERP</span>
        </NavLink>
      </div>

      <nav className="o-topbar__nav">
        <Space size={24}>
          {menuItems.map((m) => (
            <NavItem key={m.to} to={m.to} label={m.label} />
          ))}
        </Space>
      </nav>

      <div className="o-topbar__actions">
        <Space size={16} align="center">
          <NotificationBell count={unreadCount} />
          <Dropdown overlay={menu} placement="bottomRight">
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name={user.name} size={36} />
            </div>
          </Dropdown>
        </Space>
      </div>
    </header>
  );
}

export default Topbar;
