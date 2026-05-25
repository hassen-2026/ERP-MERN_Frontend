import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import Button from "../../atoms/button/Button";

import "./EditProfileForm.css";
import SelectField from "../../molecules/SelectField/SelectField";
import InputField from "../../molecules/InputField/InputField";

function EditProfileForm(props) {
  const {
    formTitle,
    labels,
    placeholders,
    roleOptions,
    customClassName,
    stackClassName,
    saveButtonClassName,
    cancelButtonClassName,
    firstNameFieldProps,
    lastNameFieldProps,
    emailFieldProps,
    phoneFieldProps,
    roleFieldProps,
    onSave,
    onCancel,
  } = {
    formTitle: "Éditer Profil",
    labels: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      role: "Rôle",
    },
    placeholders: {
      firstName: "Votre prénom",
      lastName: "Votre nom",
      email: "votre.email@exemple.com",
      phone: "+33 6 XX XX XX XX",
      role: "Sélectionner un rôle",
    },
    roleOptions: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
    customClassName: "",
    stackClassName: "",
    saveButtonClassName: "a-btn--primary",
    cancelButtonClassName: "a-btn--secondary",
    firstNameFieldProps: {},
    lastNameFieldProps: {},
    emailFieldProps: {},
    phoneFieldProps: {},
    roleFieldProps: {},
    onSave: () => {},
    onCancel: () => {},
    ...props,
  };

  return (
    <section className={`o-edit-profile-form ${customClassName}`.trim()}>
      <h3 className="o-edit-profile-form__title">{formTitle}</h3>
      <div className={`o-edit-profile-form__stack ${stackClassName}`.trim()}>
        <div className="o-edit-profile-form__row">
          <InputField
            id="profile-first-name"
            label={labels.firstName}
            placeholder={placeholders.firstName}
            {...firstNameFieldProps}
          />
          <InputField
            id="profile-last-name"
            label={labels.lastName}
            placeholder={placeholders.lastName}
            {...lastNameFieldProps}
          />
        </div>

        <InputField
          id="profile-email"
          label={labels.email}
          inputType="email"
          placeholder={placeholders.email}
          {...emailFieldProps}
        />

        <InputField
          id="profile-phone"
          label={labels.phone}
          inputType="tel"
          placeholder={placeholders.phone}
          {...phoneFieldProps}
        />

        <SelectField
          id="profile-role"
          label={labels.role}
          placeholder={placeholders.role}
          options={roleOptions}
          {...roleFieldProps}
        />

        <div className="o-edit-profile-form__actions">
          <Button customClassName={saveButtonClassName} onClick={onSave}>
            <SaveOutlined />
            <span>Enregistrer</span>
          </Button>
          <Button customClassName={cancelButtonClassName} onClick={onCancel}>
            <CloseOutlined />
            <span>Annuler</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default EditProfileForm;
