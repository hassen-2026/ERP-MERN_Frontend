import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateUser(props) {
  return (
    <RoleTemplate role="USER">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateUser;
