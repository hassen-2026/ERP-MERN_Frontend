export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
  SALES_MANAGER: "SALES_MANAGER",
  PROCUREMENT_MANAGER: "PROCUREMENT_MANAGER",
  HR_MANAGER: "HR_MANAGER",
  FINANCE_MANAGER: "FINANCE_MANAGER",
  LOGISTICS_MANAGER: "LOGISTICS_MANAGER",
};

export const ROLE_DASHBOARD_PATHS = {
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.USER]: "/dashboard/user",
  [ROLES.MANAGER]: "/dashboard/manager",
  [ROLES.SALES_MANAGER]: "/dashboard/sales",
  [ROLES.PROCUREMENT_MANAGER]: "/dashboard/procurement",
  [ROLES.HR_MANAGER]: "/dashboard/hr",
  [ROLES.FINANCE_MANAGER]: "/dashboard/finance",
  [ROLES.LOGISTICS_MANAGER]: "/dashboard/logistics",
};

export const SIGNUP_ROLE_OPTIONS = [
  { value: ROLES.USER, label: "Utilisateur" },
  { value: ROLES.SALES_MANAGER, label: "Chef des Ventes" },
  { value: ROLES.PROCUREMENT_MANAGER, label: "Responsable Achats" },
  { value: ROLES.HR_MANAGER, label: "Responsable RH" },
  { value: ROLES.FINANCE_MANAGER, label: "Responsable Finance" },
  { value: ROLES.LOGISTICS_MANAGER, label: "Responsable Logistique" },
  { value: ROLES.MANAGER, label: "Manager" },
];

const SIGNUP_ROLE_BY_SLUG = {
  user: ROLES.USER,
  manager: ROLES.MANAGER,
  sales_manager: ROLES.SALES_MANAGER,
  procurement_manager: ROLES.PROCUREMENT_MANAGER,
  hr_manager: ROLES.HR_MANAGER,
  finance_manager: ROLES.FINANCE_MANAGER,
  logistics_manager: ROLES.LOGISTICS_MANAGER,
};

export const normalizeRole = (role) => String(role || "").trim().toUpperCase();

export const resolveDashboardByRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return ROLE_DASHBOARD_PATHS[normalizedRole] || ROLE_DASHBOARD_PATHS[ROLES.USER];
};

export const resolveSignupRoleBySlug = (slug) => {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return SIGNUP_ROLE_BY_SLUG[normalizedSlug] || null;
};
