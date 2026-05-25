import "../ProfileHeader/ProfileHeader.css";
export const Profile_header_DEFAULTS = {
   avatarSrc: null,
    userName: "Utilisateur",
    userRole: "user",
    userStatus: "online",
    statusColor: "green",
    customClassName: "",
    headerClassName: "o-profile-header__container",
    cardClassName: "",
    actionsClassName: "o-profile-header__actions",
    editButtonClassName: "a-btn--primary",
    logoutButtonClassName: "a-btn--danger",
    onEdit: () => {},
    onLogout: () => {},
};