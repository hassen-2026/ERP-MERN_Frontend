import StatCard from "../../../components/molecules/StatCard/StatCard";
import DashboardTemplate from "../../../templates/TemplateUser/TemplateUser";

import { DASHBOARD_PAGE_DEFAULTS } from "../../defaults/dashboardPage_default";
import "./DashboardPage.css";

function UserDashboardPage(props) {
  const { shellProps, stats, statsClassName } = {
    ...DASHBOARD_PAGE_DEFAULTS,
    ...props,
  };

  return (
    <DashboardTemplate {...shellProps}>
      <div className={`p-dashboard__stats ${statsClassName}`.trim()}>
        {stats.map((stat) => (
          <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
        ))}
      </div>
    </DashboardTemplate>
  );
}

export default UserDashboardPage;
