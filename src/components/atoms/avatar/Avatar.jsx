import { Avatar as AntAvatar } from "antd";
import "./Avatar.css";
import { AVATAR_DOT_DEFAULTS } from "../defaults/avatarDot_default";

function Avatar(props) {
  const {
    src,
    alt,
    name,
    size,
    customClassName,
    backgroundColor,
    icon,
  } = { ...AVATAR_DOT_DEFAULTS, ...props };
    


  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const names = fullName.trim().split(" ");
    return names.length > 1
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  };

  const initials = src ? null : getInitials(name);

  return (
    <AntAvatar
      src={src}
      size={size}
      alt={alt}
      icon={icon}
      style={{ backgroundColor }}
      className={`a-avatar ${customClassName}`.trim()}
    >
      {initials}
    </AntAvatar>
  );
}

export default Avatar;
