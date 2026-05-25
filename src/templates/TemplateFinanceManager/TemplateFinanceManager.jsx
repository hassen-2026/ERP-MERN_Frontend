import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateFinanceManager(props) {
  return (
    <RoleTemplate role="FINANCE_MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateFinanceManager;
