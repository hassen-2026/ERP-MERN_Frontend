export const PROFILE_PAGE_DEFAULTS = {
  templateProps: {
    title: "Profil",
    theme: "admin",
  },
  profileHeaderProps: {
    userName: "Utilisateur",
    userRole: "user",
    userStatus: "online",
    statusColor: "green",
    onEdit: () => {},
    onLogout: () => {},
  },
  profileStatsProps: {
    stats: [
      { label: "Commandes", value: "0" },
      { label: "Montant Total", value: "$0" },
      { label: "Depuis", value: "N/A" },
    ],
  },
  profileFieldsProps: {
    fields: [
      { label: "Email", value: "email@exemple.com" },
      { label: "Téléphone", value: "N/A" },
      { label: "Adresse", value: "N/A" },
      { label: "Ville", value: "N/A" },
    ],
  },
  editFormProps: {
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
    onSave: () => {},
    onCancel: () => {},
  },
  pageContainerClassName: "p-profile__container",
  pageLayoutClassName: "p-profile__layout",
  sectionsClassName: "p-profile__sections",
};
