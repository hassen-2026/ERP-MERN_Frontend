import React from "react";
import { useSelector } from "react-redux";

import TemplateUser from "../TemplateUser/TemplateUser";
import TemplateManager from "../TemplateManager/TemplateManager";
import TemplateSalesManager from "../TemplateSalesManager/TemplateSalesManager";
import TemplateProcurementManager from "../TemplateProcurementManager/TemplateProcurementManager";
import TemplateHRManager from "../TemplateHRManager/TemplateHRManager";
import TemplateFinanceManager from "../TemplateFinanceManager/TemplateFinanceManager";
import TemplateLogisticsManager from "../TemplateLogisticsManager/TemplateLogisticsManager";
import TemplateAdmin from "../TemplateAdmin/TemplateAdmin";

function TemplateSelector({ role: roleProp, children, ...rest }) {
  const roleFromStore = useSelector(
    (state) => state.user?.user?.role || state.user?.user?.type || "USER"
  );

  const normalizedRole = String(roleProp || roleFromStore || "USER").trim().toUpperCase();

  const roleTemplateMap = {
    MANAGER: TemplateManager,
    SALES_MANAGER: TemplateSalesManager,
    PROCUREMENT_MANAGER: TemplateProcurementManager,
    HR_MANAGER: TemplateHRManager,
    FINANCE_MANAGER: TemplateFinanceManager,
    LOGISTICS_MANAGER: TemplateLogisticsManager,
    ADMIN: TemplateAdmin,
    USER: TemplateUser,
  };

  const ChosenTemplate = roleTemplateMap[normalizedRole] || TemplateUser;

  return <ChosenTemplate {...rest}>{children}</ChosenTemplate>;
}

export default TemplateSelector;
