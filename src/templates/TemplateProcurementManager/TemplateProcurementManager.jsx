import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateProcurementManager(props) {
  return (
    <RoleTemplate role="PROCUREMENT_MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateProcurementManager;
