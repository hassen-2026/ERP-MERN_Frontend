import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { fetchHrTrainings, updateHrTrainingThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditTrainingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const trainingState = useSelector((state) => state.hr?.trainings || {});
  const trainings = trainingState.items || [];

  useEffect(() => {
    if (!trainings.length && !trainingState.loading) dispatch(fetchHrTrainings());
  }, [dispatch, trainings.length, trainingState.loading]);

  const training = useMemo(() => trainings.find((item) => String(item.id) === String(id)) || null, [trainings, id]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrTrainingThunk(id, formValues));
    if (result?.success) navigate("/rh/trainings", { state: { successMessage: "Formation mise à jour avec succès." } });
  };

  return (
    <DashboardTemplate>
      {!trainingState.loading && !training ? <div className="p-card p-product-page__state">Formation introuvable.</div> : null}
      {training ? (
        <EntityForm
          formTitle="Modifier une formation"
          fields={{
            title: { label: "Titre", placeholder: "Titre de la formation", type: "input", inputType: "text", defaultValue: training.title || "" },
            provider: { label: "Organisme", placeholder: "Organisme de formation", type: "input", inputType: "text", defaultValue: training.provider || "" },
            startDate: { label: "Début", placeholder: "Date de début", type: "input", inputType: "date", defaultValue: training.startDateIso ? String(training.startDateIso).slice(0, 10) : "" },
            endDate: { label: "Fin", placeholder: "Date de fin", type: "input", inputType: "date", defaultValue: training.endDateIso ? String(training.endDateIso).slice(0, 10) : "" },
            budget: { label: "Budget", placeholder: "Budget", type: "input", inputType: "number", defaultValue: training.budget ?? 0 },
            status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Planifiée", value: "PLANNED" }, { label: "En cours", value: "IN_PROGRESS" }, { label: "Terminée", value: "COMPLETED" }, { label: "Annulée", value: "CANCELLED" }], defaultValue: training.status || "PLANNED" },
            location: { label: "Lieu", placeholder: "Lieu de la formation", type: "input", inputType: "text", defaultValue: training.location || "" },
            summary: { label: "Résumé", placeholder: "Description courte", type: "input", inputType: "text", defaultValue: training.summary || "" },
          }}
          initialValues={{
            title: training.title,
            provider: training.provider,
            startDate: training.startDateIso ? String(training.startDateIso).slice(0, 10) : "",
            endDate: training.endDateIso ? String(training.endDateIso).slice(0, 10) : "",
            budget: training.budget,
            status: training.status,
            location: training.location,
            summary: training.summary,
          }}
          fieldOrder={["title", "provider", "startDate", "endDate", "budget", "status", "location", "summary"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/trainings")}
          saveLoading={trainingState.updating}
          saveError={trainingState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditTrainingPage;

