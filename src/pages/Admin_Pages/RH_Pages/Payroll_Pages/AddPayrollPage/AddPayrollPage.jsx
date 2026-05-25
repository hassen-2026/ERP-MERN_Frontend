import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrPayrollThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddPayrollPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payrollState = useSelector((state) => state.hr?.payrolls || {});

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrPayrollThunk(formValues));
    if (result?.success) navigate("/rh/payrolls", { state: { successMessage: "Paie ajoutée avec succès." } });
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter une paie"
        fields={{
          employeeId: { label: "Employé", placeholder: "ID employé", type: "input", inputType: "text", defaultValue: "" },
          periodMonth: { label: "Mois", placeholder: "Mois", type: "input", inputType: "number", defaultValue: new Date().getMonth() + 1 },
          periodYear: { label: "Année", placeholder: "Année", type: "input", inputType: "number", defaultValue: new Date().getFullYear() },
          baseSalary: { label: "Salaire de base", placeholder: "Salaire de base", type: "input", inputType: "number", defaultValue: 0 },
          bonus: { label: "Prime", placeholder: "Prime", type: "input", inputType: "number", defaultValue: 0 },
          deductions: { label: "Retenues", placeholder: "Retenues", type: "input", inputType: "number", defaultValue: 0 },
          status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Payée", value: "PAID" }, { label: "Bloquée", value: "BLOCKED" }], defaultValue: "DRAFT" },
          paymentDate: { label: "Date de paiement", placeholder: "Date de paiement", type: "input", inputType: "date", defaultValue: "" },
        }}
        fieldOrder={["employeeId", "periodMonth", "periodYear", "baseSalary", "bonus", "deductions", "status", "paymentDate"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/payrolls")}
        saveLoading={payrollState.creating}
        saveError={payrollState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddPayrollPage;


