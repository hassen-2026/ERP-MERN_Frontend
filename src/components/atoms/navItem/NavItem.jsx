import { NavLink } from "react-router-dom";
import { NAV_ITEM_DEFAULTS } from "../defaults/navItem_default";
import "./NavItem.css";

function NavItem(props) {
  const { label, to, customClassName, activeClassName } = {
    ...NAV_ITEM_DEFAULTS,
    ...props,
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${customClassName} ${isActive ? activeClassName : ""}`.trim()
      }
    >
      {label}
    </NavLink>
  );
}

export default NavItem;
