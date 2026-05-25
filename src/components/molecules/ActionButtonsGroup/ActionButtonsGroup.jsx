import React from "react";
import { useSelector } from "react-redux";
import Button from "../../atoms/button/Button";
import { ACTION_BUTTONS_GROUP_DEFAULTS } from "../defaults/actionButtonsGroup_default";
import "./ActionButtonsGroup.css";

function ActionButtonsGroup(props) {
  const {
    actions,
    containerClassName,
    buttonVariant,
  } = {
    ...ACTION_BUTTONS_GROUP_DEFAULTS,
    ...props,
  };

  const roleFromStore = useSelector((state) => state.user?.user?.role || state.user?.user?.type || "USER");
  const normalizedRole = String(roleFromStore || "USER").trim().toUpperCase();

  const visibleActions = (actions || []).filter((action) => {
    if (!action) return false;
    if (!action.allowedRoles || action.allowedRoles.length === 0) return true;

    const allowed = action.allowedRoles.map((r) => String(r || "").trim().toUpperCase());
    return allowed.includes(normalizedRole);
  });

  return (
    <div className={containerClassName}>
      {visibleActions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || buttonVariant}
          customClassName={action.className || ""}
          onClick={action.onClick}
          disabled={Boolean(action.disabled)}
        >
          {action.icon ? <span className="m-action-buttons__icon">{action.icon}</span> : null}
          {action.label}
        </Button>
      ))}
    </div>
  );
}

export default ActionButtonsGroup;
