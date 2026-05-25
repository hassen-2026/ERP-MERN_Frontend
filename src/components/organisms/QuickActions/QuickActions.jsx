import { useNavigate } from "react-router-dom";
import Button from "../../atoms/button/Button";
import { QUICK_ACTIONS_DEFAULTS } from "../defaults/quickActions_default";
import "./QuickActions.css";

function QuickActions(props) {
  const navigate = useNavigate();
  const { title, actions, customClassName, titleClassName, buttonsClassName, onAction } = {
    ...QUICK_ACTIONS_DEFAULTS,
    ...props,
  };

  return (
    <section className={`o-quick-actions ${customClassName}`.trim()}>
      <h3 className={`o-quick-actions__title ${titleClassName}`.trim()}>{title}</h3>
      <div className={`o-quick-actions__buttons ${buttonsClassName}`.trim()}>
        {actions.map((action) => (
          <Button
            key={action.id}
            customClassName={`o-quick-actions__btn ${action.customClassName || ""}`.trim()}
            onClick={() => {
              if (typeof onAction === "function") {
                onAction(action);
                return;
              }
              if (action.to) {
                navigate(action.to);
              }
            }}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
