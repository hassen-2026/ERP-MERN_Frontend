import RoleTemplate from "../RoleTemplate/RoleTemplate";

function TemplateAdmin(props) {
  return (
    <RoleTemplate role="ADMIN">
      {props.children}
    </RoleTemplate>
  );
}

export default TemplateAdmin;
