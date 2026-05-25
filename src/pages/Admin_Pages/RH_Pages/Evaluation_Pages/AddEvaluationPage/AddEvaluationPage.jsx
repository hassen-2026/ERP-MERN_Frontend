import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrEvaluationThunk, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddEvaluationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const evaluationState = useSelector((state) => state.hr?.evaluations || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const employees = employeeState.items || [];

  useEffect(() => {
    if (!employees.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, employeeState.loading, employees.length]);

  const employeeOptions = useMemo(() => employees.map((item) => ({ label: item.fullName, value: item.id })), [employees]);

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrEvaluationThunk(formValues));
    if (result?.success) navigate("/rh/evaluations", { state: { successMessage: "Évaluation ajoutée avec succès." } });
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter une évaluation"
        fields={{
          employeeId: { label: "Employé", placeholder: "Sélectionner un employé", type: "select", options: employeeOptions, defaultValue: undefined },
          evaluationDate: { label: "Date", placeholder: "Date d'évaluation", type: "input", inputType: "date", defaultValue: "" },
          periodStart: { label: "Début période", placeholder: "Début", type: "input", inputType: "date", defaultValue: "" },
          periodEnd: { label: "Fin période", placeholder: "Fin", type: "input", inputType: "date", defaultValue: "" },
          technicalScore: { label: "Score technique", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: 0 },
          behaviorScore: { label: "Score comportement", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: 0 },
          goalScore: { label: "Score objectifs", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: 0 },
          status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Validée", value: "APPROVED" }, { label: "Rejetée", value: "REJECTED" }], defaultValue: "DRAFT" },
          summary: { label: "Résumé", placeholder: "Résumé de l'évaluation", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["employeeId", "evaluationDate", "periodStart", "periodEnd", "technicalScore", "behaviorScore", "goalScore", "status", "summary"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/evaluations")}
        saveLoading={evaluationState.creating}
        saveError={evaluationState.createError}
      />
    </TemplateSelector>
  );
}

export default AddEvaluationPage;


