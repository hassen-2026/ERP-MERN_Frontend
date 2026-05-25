import AvatarDot from "../../atoms/avatarDot/AvatarDot";
import BrandText from "../../atoms/brandText/BrandText";
import { USER_BADGE_DEFAULTS } from "../defaults/userBadge_default";
import "./UserBadge.css";

function UserBadge(props) {
  const { username, customClassName, avatarClassName, usernameClassName } = {
    ...USER_BADGE_DEFAULTS,
    ...props,
  };

  return (
    <div className={customClassName}>
      <AvatarDot customClassName={avatarClassName} />
      <BrandText text={username} customClassName={usernameClassName} as="span" />
    </div>
  );
}

export default UserBadge;
