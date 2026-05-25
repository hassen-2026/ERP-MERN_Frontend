import { useState } from "react";
import Sidebar from "../../components/organisms/Sidebar/Sidebar";
import Topbar from "../../components/organisms/Topbar/Topbar";
import { useSelector } from "react-redux";

import { APP_SHELL_DEFAULTS } from "../defaults/DashboardTemplate";
import { ROLE_MENU_ITEMS } from "../roleMenus";
import "./RoleTemplate.css";

function RoleTemplate(props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    children,
    title,
    customClassName,
    mainClassName,
    contentClassName,
    titleClassName,
    sidebarProps,
    role = "USER",
    fallbackMenuItems = [],
  } = { ...APP_SHELL_DEFAULTS, ...props };

  const normalizedRole = String(role || "USER").trim().toUpperCase();
  const menuItems =
    ROLE_MENU_ITEMS[normalizedRole] ||
    (Array.isArray(fallbackMenuItems) ? fallbackMenuItems : ROLE_MENU_ITEMS.USER);

  const finalSidebarProps = {
    ...sidebarProps,
    menuItems,
    isOpen: sidebarOpen,
    onToggle: () => setSidebarOpen(!sidebarOpen),
  };

  return (
    <div className={`t-shell ${customClassName}`.trim()}>
      <Sidebar {...finalSidebarProps} />
      <div className={`t-shell__main ${mainClassName}`.trim()}>
        <Topbar  user={useSelector((s) => s.user.user)} />
        <main className={`t-shell__content ${contentClassName}`.trim()}>
          {title ? <h1 className={`t-shell__title ${titleClassName}`.trim()}>{title}</h1> : null}
          {children}
        </main>
      </div>
    </div>
  );
}

export default RoleTemplate;
