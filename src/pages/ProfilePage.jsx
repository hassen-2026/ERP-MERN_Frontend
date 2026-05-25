import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TemplateSelector from "../templates/TemplateSelector/TemplateSelector";
import ProfileHeader from "../components/organisms/ProfileHeader/ProfileHeader";
import ProfileStats from "../components/organisms/ProfileStats/ProfileStats";
import ProfileField from "../components/organisms/ProfileField/ProfileField";
import EditProfileForm from "../components/organisms/EditProfileForm/EditProfileForm";
import { PROFILE_PAGE_DEFAULTS } from "./defaults/profilePage_default";
import { logoutUser } from "../redux/reducers/UserReducer";
import "./ProfilePage.css";

function ProfilePage(props) {
  const { templateProps, profileHeaderProps, profileStatsProps, profileFieldsProps, editFormProps } = {
    ...PROFILE_PAGE_DEFAULTS,
    ...props,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = userState?.user || {};
  const userName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Utilisateur";
  const userRole = currentUser.role || "user";
  const userEmail = currentUser.email || "N/A";
  const userPhone = currentUser.phone || "N/A";

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const resolvedProfileHeaderProps = {
    ...profileHeaderProps,
    avatarSrc: currentUser.imageUrl || profileHeaderProps.avatarSrc || null,
    userName,
    userRole,
    onEdit: handleEdit,
    onLogout: handleLogout,
  };

  const resolvedProfileFieldsProps = profileFieldsProps.fields.map((field) => {
    if (field.label === "Email") return { ...field, value: userEmail };
    if (field.label === "Téléphone") return { ...field, value: userPhone };
    return field;
  });

  const resolvedEditFormProps = {
    ...editFormProps,
    firstNameFieldProps: { value: currentUser.firstName || "", placeholder: "Prénom" },
    lastNameFieldProps: { value: currentUser.lastName || "", placeholder: "Nom" },
    emailFieldProps: { value: userEmail, placeholder: "Email" },
    phoneFieldProps: { value: userPhone, placeholder: "Téléphone" },
    onSave: handleSaveProfile,
    onCancel: handleCancelEdit,
  };

  return (
    <TemplateSelector {...templateProps}>
      <div className="p-profile__container">
        <div className="p-profile__layout">
      
          <ProfileHeader {...resolvedProfileHeaderProps} />

        
          <div className="p-profile__sections">
        
            <section className="p-profile__stats-section">
              <h3 className="p-profile__section-title">Statistiques</h3>
              <ProfileStats {...profileStatsProps} />
            </section>

 
            {!isEditing && (
              <section className="p-profile__info-section">
                <h3 className="p-profile__section-title">Informations Personnelles</h3>
                <div className="p-profile__fields">
                  {resolvedProfileFieldsProps.map((field, idx) => (
                    <ProfileField key={`field-${idx}`} label={field.label} value={field.value} />
                  ))}
                </div>
              </section>
            )}

   
            {isEditing && (
              <section className="p-profile__edit-section">
                <EditProfileForm {...resolvedEditFormProps} />
              </section>
            )}
          </div>
        </div>
      </div>
    </TemplateSelector>
  );
}

export default ProfilePage;
