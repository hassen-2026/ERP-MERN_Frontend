import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateManager(props) {
  return (
    <RoleTemplate role="MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateManager;
