import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrPayrolls } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function PayrollDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const payrollState = useSelector((state) => state.hr?.payrolls || {});
  const payrolls = payrollState.items || [];

  useEffect(() => {
    if (!payrolls.length && !payrollState.loading) dispatch(fetchHrPayrolls());
  }, [dispatch, payrolls.length, payrollState.loading]);

  const payroll = useMemo(() => payrolls.find((item) => String(item.id) === String(id)) || null, [payrolls, id]);

  const infoRows = [
    { label: "Employé", value: payroll?.employeeName || "-" },
    { label: "Période", value: payroll?.periodLabel || "-" },
    { label: "Brut", value: payroll?.grossSalary ?? 0 },
    { label: "Prime", value: payroll?.bonus ?? 0 },
    { label: "Retenues", value: payroll?.deductions ?? 0 },
    { label: "Net", value: payroll?.netSalary ?? 0 },
    { label: "Date paiement", value: payroll?.paymentDate || "-" },
    { label: "Statut", value: payroll?.statusLabel || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={payroll ? `Paie - ${payroll.employeeName}` : "Détail paie"}
          subtitle={payroll?.periodLabel || ""}
          actions={[{ id: "back", label: "Retour", className: "p-supplier-toolbar-btn", onClick: () => navigate("/rh/payrolls") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!payrollState.loading && !payroll ? <div className="p-card p-supplier-page__state">Paie introuvable.</div> : null}
        {payroll ? <Overview item={payroll} itemSectionTitle="Informations paie" infoRows={infoRows} /> : null}
      </div>
    </DashboardTemplate>
  );
}

export default PayrollDetailPage;
