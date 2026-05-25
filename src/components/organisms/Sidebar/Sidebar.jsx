import BrandText from "../../atoms/brandText/BrandText";
import SidebarMenu from "../../molecules/SidebarMenu/SidebarMenu";
import { useSelector } from "react-redux";
import { SIDEBAR_DEFAULTS } from "../defaults/sidebar_default";
import "./Sidebar.css";

function Sidebar(props) {
  const role = useSelector((state) => state.user?.user?.role || 'n/a');
  const token = useSelector((state) => state.user?.token || null);
  const {
    brand,
    menuItems,
    customClassName,
    menuClassName,
    itemClassName,
    activeItemClassName,
    brandClassName,
    isOpen = true,
    onToggle,
  } = { ...SIDEBAR_DEFAULTS, ...props };

  return (
    <aside className={`o-sidebar ${!isOpen ? 'o-sidebar--collapsed' : ''} ${customClassName}`.trim()}>
      <BrandText
        text={brand}
        as="div"
        customClassName={`o-sidebar__brand ${brandClassName}`.trim()}
      />
      <div className="o-sidebar__content">
        <SidebarMenu
          items={menuItems}
          customClassName={`o-sidebar__menu ${menuClassName}`.trim()}
          itemClassName={`o-sidebar__item ${itemClassName}`.trim()}
          activeItemClassName={`o-sidebar__item--active ${activeItemClassName}`.trim()}
        />
        {process.env.NODE_ENV !== 'production' && (
          <div className="o-sidebar__debug">
            <small style={{display: 'block', marginTop: 12, color: '#999'}}>
              Role: {role}
            </small>
            <small style={{display: 'block', color: '#999'}}>
              Token: {String(token || 'n/a').slice(0,20)}{token ? '...' : ''}
            </small>
          </div>
        )}
        {onToggle && (
          <button 
            className={`o-sidebar__toggle ${isOpen ? 'o-sidebar__toggle--open' : 'o-sidebar__toggle--closed'}`}
            onClick={onToggle}
            title={isOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
          >
            {isOpen ? "‹" : "›"}
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
