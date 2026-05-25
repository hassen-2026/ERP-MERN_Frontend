import TemplateUser from "../../../templates/TemplateUser/TemplateUser";
import TemplateManager from "../../../templates/TemplateManager/TemplateManager";
import TemplateSalesManager from "../../../templates/TemplateSalesManager/TemplateSalesManager";
import TemplateProcurementManager from "../../../templates/TemplateProcurementManager/TemplateProcurementManager";
import TemplateHRManager from "../../../templates/TemplateHRManager/TemplateHRManager";
import TemplateFinanceManager from "../../../templates/TemplateFinanceManager/TemplateFinanceManager";
import TemplateLogisticsManager from "../../../templates/TemplateLogisticsManager/TemplateLogisticsManager";
import { DashboardStatsGrid } from "../../../components/DashboardLayout";
import { useSelector } from "react-redux";

// Import role-specific dashboard components
import ManagerDashboard from "../../Dashboards/ManagerDashboard";
import SalesManagerDashboard from "../../Dashboards/SalesManagerDashboard";
import ProcurementDashboard from "../../Dashboards/ProcurementDashboard";
import HRDashboard from "../../Dashboards/HRDashboard";
import FinanceDashboard from "../../Dashboards/FinanceDashboard";
import LogisticsDashboard from "../../Dashboards/LogisticsDashboard";
import UserDashboard from "../../Dashboards/UserDashboard";

import { DASHBOARD_PAGE_DEFAULTS } from "../../defaults/dashboardPage_default";
import "../../DashboardPage.css";

function DashboardUserPage(props) {
  const role = useSelector((state) => state.user?.user?.role || state.user?.user?.type || "USER");
  const normalizedRole = String(role || "USER").trim().toUpperCase();

  const roleTemplateMap = {
    MANAGER: TemplateManager,
    SALES_MANAGER: TemplateSalesManager,
    PROCUREMENT_MANAGER: TemplateProcurementManager,
    HR_MANAGER: TemplateHRManager,
    FINANCE_MANAGER: TemplateFinanceManager,
    LOGISTICS_MANAGER: TemplateLogisticsManager,
    USER: TemplateUser,
  };

  const DashboardTemplate = roleTemplateMap[normalizedRole] || TemplateUser;

  const {
    shellProps,
    stats,
    
    statsClassName,
  
  } = { ...DASHBOARD_PAGE_DEFAULTS, ...props };

  // Map role to dashboard component
  const roleDashboardMap = {
    MANAGER: ManagerDashboard,
    SALES_MANAGER: SalesManagerDashboard,
    PROCUREMENT_MANAGER: ProcurementDashboard,
    HR_MANAGER: HRDashboard,
    FINANCE_MANAGER: FinanceDashboard,
    LOGISTICS_MANAGER: LogisticsDashboard,
    USER: UserDashboard,
  };

  const RoleDashboard = roleDashboardMap[normalizedRole];

  return (
    <DashboardTemplate {...shellProps}>
      {RoleDashboard ? (
        <RoleDashboard />
      ) : (
        <DashboardStatsGrid stats={stats} />
      )}
    </DashboardTemplate>
  );
}

export default DashboardUserPage;
