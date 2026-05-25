import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateHRManager(props) {
  return (
    <RoleTemplate role="HR_MANAGER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateHRManager;
