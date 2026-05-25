import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { fetchHrPayrolls, updateHrPayrollThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditPayrollPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const payrollState = useSelector((state) => state.hr?.payrolls || {});
  const payrolls = payrollState.items || [];

  useEffect(() => {
    if (!payrolls.length && !payrollState.loading) dispatch(fetchHrPayrolls());
  }, [dispatch, payrolls.length, payrollState.loading]);

  const payroll = useMemo(() => payrolls.find((item) => String(item.id) === String(id)) || null, [payrolls, id]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrPayrollThunk(id, formValues));
    if (result?.success) navigate("/rh/payrolls", { state: { successMessage: "Paie mise à jour avec succès." } });
  };

  return (
    <DashboardTemplate>
      {!payrollState.loading && !payroll ? <div className="p-card p-product-page__state">Paie introuvable.</div> : null}
      {payroll ? (
        <EntityForm
          formTitle="Modifier une paie"
          fields={{
            employeeId: { label: "Employé", placeholder: "ID employé", type: "input", inputType: "text", defaultValue: payroll.employeeId || "" },
            periodMonth: { label: "Mois", placeholder: "Mois", type: "input", inputType: "number", defaultValue: payroll.periodMonth ?? new Date().getMonth() + 1 },
            periodYear: { label: "Année", placeholder: "Année", type: "input", inputType: "number", defaultValue: payroll.periodYear ?? new Date().getFullYear() },
            baseSalary: { label: "Salaire de base", placeholder: "Salaire de base", type: "input", inputType: "number", defaultValue: payroll.baseSalary ?? 0 },
            bonus: { label: "Prime", placeholder: "Prime", type: "input", inputType: "number", defaultValue: payroll.bonus ?? 0 },
            deductions: { label: "Retenues", placeholder: "Retenues", type: "input", inputType: "number", defaultValue: payroll.deductions ?? 0 },
            status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Payée", value: "PAID" }, { label: "Bloquée", value: "BLOCKED" }], defaultValue: payroll.status || "DRAFT" },
            paymentDate: { label: "Date de paiement", placeholder: "Date de paiement", type: "input", inputType: "date", defaultValue: payroll.paymentDateIso ? String(payroll.paymentDateIso).slice(0, 10) : "" },
          }}
          initialValues={{
            employeeId: payroll.employeeId,
            periodMonth: payroll.periodMonth,
            periodYear: payroll.periodYear,
            baseSalary: payroll.baseSalary,
            bonus: payroll.bonus,
            deductions: payroll.deductions,
            status: payroll.status,
            paymentDate: payroll.paymentDateIso ? String(payroll.paymentDateIso).slice(0, 10) : "",
          }}
          fieldOrder={["employeeId", "periodMonth", "periodYear", "baseSalary", "bonus", "deductions", "status", "paymentDate"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/payrolls")}
          saveLoading={payrollState.updating}
          saveError={payrollState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditPayrollPage;

