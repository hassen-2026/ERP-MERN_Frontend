import TemplateSelector from "../../../templates/TemplateSelector/TemplateSelector";

import { DASHBOARD_PAGE_DEFAULTS } from "../../defaults/dashboardPage_default";
import "../../DashboardPage.css";
import QuickActions from "../../../components/organisms/QuickActions/QuickActions";
import AdminDashboard from "../../Dashboards/AdminDashboard";

const QUICK_ACTIONS = {
  title: "Actions Rapides",
  actions: [
    { id: "add-product", label: "+ Ajouter Produit", to: "/product/add", customClassName: "" },
    {
      id: "new-sale",
      label: "Nouvelle Vente",
      to: "/sales/new",
      customClassName: "o-quick-actions__btn--success",
    },
    {
      id: "new-buy",
      label: "Nouvel Achat",
      to: "",
      customClassName: "o-quick-actions__btn--warning",
    },
    {
      id: "see-moves",
      label: "Voir Mouvements",
      to: "/stock-movements",
      customClassName: "o-quick-actions__btn--info",
    },
  ],
  customClassName: "",
  titleClassName: "",
  buttonsClassName: "",
  onAction: null,
};

function DashboardAdminPage(props) {
  const {
    shellProps,
  } = { ...DASHBOARD_PAGE_DEFAULTS, ...props };

  return (
    <TemplateSelector {...shellProps}>
      <AdminDashboard />
      <QuickActions {...QUICK_ACTIONS} />
    </TemplateSelector>
  );
}

export default DashboardAdminPage;
