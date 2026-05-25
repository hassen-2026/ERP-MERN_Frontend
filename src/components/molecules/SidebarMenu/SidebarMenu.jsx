import NavItem from "../../atoms/navItem/NavItem";
import { SIDEBAR_MENU_DEFAULTS } from "../defaults/sidebarMenu_default";
import "./SidebarMenu.css";

function SidebarMenu(props) {
  const { items, customClassName, itemClassName, activeItemClassName } = {
    ...SIDEBAR_MENU_DEFAULTS,
    ...props,
  };

  return (
    <nav className={customClassName}>
      {items.map((item) => (
        <NavItem
          key={`${item.to}-${item.label}`}
          label={item.label}
          to={item.to}
          customClassName={`${itemClassName} ${item.customClassName || ""}`.trim()}
          activeClassName={`${activeItemClassName} ${item.activeClassName || ""}`.trim()}
        />
      ))}
    </nav>
  );
}

export default SidebarMenu;
