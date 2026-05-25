import Avatar from "../../atoms/avatar/Avatar";
import Badge from "../../atoms/badge/Badge";
import Typography from "../../atoms/Typography/Typography";
import "./ProfileCard.css";

function ProfileCard(props) {
  const {
    avatarSrc,
    userName,
    userRole,
    userStatus,
    statusColor,
    customClassName,
    cardClassName,
    avatarClassName,
    infoClassName,
    nameClassName,
    roleClassName,
    badgeClassName,
  } = {
    avatarSrc: null,
    userName: "Utilisateur",
    userRole: "user",
    userStatus: "online",
    statusColor: "green",
    customClassName: "",
    cardClassName: "m-profile-card__container",
    avatarClassName: "m-profile-card__avatar",
    infoClassName: "m-profile-card__info",
    nameClassName: "m-profile-card__name",
    roleClassName: "m-profile-card__role",
    badgeClassName: "m-profile-card__badge",
    ...props,
  };

  return (
    <div className={`m-profile-card ${customClassName}`.trim()}>
      <div className={cardClassName}>
        <Avatar
          src={avatarSrc}
          name={userName}
          size={80}
          customClassName={avatarClassName}
          backgroundColor="#1890ff"
        />
        <div className={infoClassName}>
          <Typography variant="title" level={3} className={nameClassName}>
            {userName}
          </Typography>
          <Typography variant="text" className={roleClassName}>
            {userRole}
          </Typography>
          <div className={badgeClassName}>
            <Badge status={userStatus} color={statusColor} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
