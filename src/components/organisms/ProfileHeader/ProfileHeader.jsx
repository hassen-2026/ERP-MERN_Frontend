import { EditOutlined, LogoutOutlined } from "@ant-design/icons";
import Button from "../../atoms/button/Button";
import ProfileCard from "../../molecules/ProfileCard/ProfileCard";
import "./ProfileHeader.css";
import { Profile_header_DEFAULTS } from "../defaults/ProfileHeader_default";

function ProfileHeader(props) {
  const {
    avatarSrc,
    userName,
    userRole,
    userStatus,
    statusColor,
    customClassName,
    headerClassName,
    cardClassName,
    actionsClassName,
    editButtonClassName,
    logoutButtonClassName,
    onEdit,
    onLogout,
  } = {
    ...Profile_header_DEFAULTS,
    ...props,
  };

  return (
    <header className={`o-profile-header ${customClassName}`.trim()}>
      <div className={headerClassName}>
        <ProfileCard
          avatarSrc={avatarSrc}
          userName={userName}
          userRole={userRole}
          userStatus={userStatus}
          statusColor={statusColor}
          customClassName={cardClassName}
        />
        <div className={actionsClassName}>
          <Button customClassName={editButtonClassName} onClick={onEdit}>
            <EditOutlined />
            <span>Éditer</span>
          </Button>
          
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
