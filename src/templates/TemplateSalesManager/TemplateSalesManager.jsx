import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateSalesManager(props) {
  return (
    <RoleTemplate role="SALES_MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateSalesManager;
