import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrTrainingThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddTrainingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trainingState = useSelector((state) => state.hr?.trainings || {});

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrTrainingThunk(formValues));
    if (result?.success) navigate("/rh/trainings", { state: { successMessage: "Formation ajoutée avec succès." } });
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter une formation"
        fields={{
          title: { label: "Titre", placeholder: "Titre de la formation", type: "input", inputType: "text", defaultValue: "" },
          provider: { label: "Organisme", placeholder: "Organisme de formation", type: "input", inputType: "text", defaultValue: "" },
          startDate: { label: "Début", placeholder: "Date de début", type: "input", inputType: "date", defaultValue: "" },
          endDate: { label: "Fin", placeholder: "Date de fin", type: "input", inputType: "date", defaultValue: "" },
          budget: { label: "Budget", placeholder: "Budget", type: "input", inputType: "number", defaultValue: 0 },
          status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Planifiée", value: "PLANNED" }, { label: "En cours", value: "IN_PROGRESS" }, { label: "Terminée", value: "COMPLETED" }, { label: "Annulée", value: "CANCELLED" }], defaultValue: "PLANNED" },
          location: { label: "Lieu", placeholder: "Lieu de la formation", type: "input", inputType: "text", defaultValue: "" },
          summary: { label: "Résumé", placeholder: "Description courte", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["title", "provider", "startDate", "endDate", "budget", "status", "location", "summary"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/trainings")}
        saveLoading={trainingState.creating}
        saveError={trainingState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddTrainingPage;

