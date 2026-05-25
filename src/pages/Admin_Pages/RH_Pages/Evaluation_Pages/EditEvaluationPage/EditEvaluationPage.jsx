import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { fetchHrEvaluations, fetchHrEmployees, updateHrEvaluationThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditEvaluationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const evaluationState = useSelector((state) => state.hr?.evaluations || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const evaluations = evaluationState.items || [];
  const employees = employeeState.items || [];

  useEffect(() => {
    if (!evaluations.length && !evaluationState.loading) dispatch(fetchHrEvaluations());
    if (!employees.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, evaluations.length, evaluationState.loading, employeeState.loading, employees.length]);

  const evaluation = useMemo(() => evaluations.find((item) => String(item.id) === String(id)) || null, [evaluations, id]);
  const employeeOptions = useMemo(() => employees.map((item) => ({ label: item.fullName, value: item.id })), [employees]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrEvaluationThunk(id, formValues));
    if (result?.success) navigate("/rh/evaluations", { state: { successMessage: "Évaluation mise à jour avec succès." } });
  };

  return (
    <TemplateSelector>
      {!evaluationState.loading && !evaluation ? <div className="p-card p-product-page__state">Évaluation introuvable.</div> : null}
      {evaluation ? (
        <EntityForm
          formTitle="Modifier une évaluation"
          fields={{
            employeeId: { label: "Employé", placeholder: "Sélectionner un employé", type: "select", options: employeeOptions, defaultValue: evaluation.employeeId || undefined },
            evaluationDate: { label: "Date", placeholder: "Date d'évaluation", type: "input", inputType: "date", defaultValue: evaluation.evaluationDateIso ? String(evaluation.evaluationDateIso).slice(0, 10) : "" },
            periodStart: { label: "Début période", placeholder: "Début", type: "input", inputType: "date", defaultValue: evaluation.periodStartIso ? String(evaluation.periodStartIso).slice(0, 10) : "" },
            periodEnd: { label: "Fin période", placeholder: "Fin", type: "input", inputType: "date", defaultValue: evaluation.periodEndIso ? String(evaluation.periodEndIso).slice(0, 10) : "" },
            technicalScore: { label: "Score technique", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: evaluation.technicalScore ?? 0 },
            behaviorScore: { label: "Score comportement", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: evaluation.behaviorScore ?? 0 },
            goalScore: { label: "Score objectifs", placeholder: "0 à 100", type: "input", inputType: "number", defaultValue: evaluation.goalScore ?? 0 },
            status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Brouillon", value: "DRAFT" }, { label: "En attente", value: "PENDING" }, { label: "Validée", value: "APPROVED" }, { label: "Rejetée", value: "REJECTED" }], defaultValue: evaluation.status || "DRAFT" },
            summary: { label: "Résumé", placeholder: "Résumé de l'évaluation", type: "input", inputType: "text", defaultValue: evaluation.summary || "" },
          }}
          initialValues={{
            employeeId: evaluation.employeeId,
            evaluationDate: evaluation.evaluationDateIso ? String(evaluation.evaluationDateIso).slice(0, 10) : "",
            periodStart: evaluation.periodStartIso ? String(evaluation.periodStartIso).slice(0, 10) : "",
            periodEnd: evaluation.periodEndIso ? String(evaluation.periodEndIso).slice(0, 10) : "",
            technicalScore: evaluation.technicalScore,
            behaviorScore: evaluation.behaviorScore,
            goalScore: evaluation.goalScore,
            status: evaluation.status,
            summary: evaluation.summary,
          }}
          fieldOrder={["employeeId", "evaluationDate", "periodStart", "periodEnd", "technicalScore", "behaviorScore", "goalScore", "status", "summary"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/evaluations")}
          saveLoading={evaluationState.updating}
          saveError={evaluationState.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditEvaluationPage;


