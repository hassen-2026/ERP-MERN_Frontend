import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateLogisticsManager(props) {
  return (
    <RoleTemplate role="LOGISTICS_MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateLogisticsManager;
