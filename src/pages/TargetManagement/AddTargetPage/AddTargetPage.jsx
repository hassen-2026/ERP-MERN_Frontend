import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import TemplateSelector from "../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../components/organisms/EntityForm/EntityForm";
import { createTarget } from "../../../services/targetApi";

const TARGET_FIELDS = {
  name: { type: "input", label: "Nom", placeholder: "Ex: Objectif Achats Janvier 2026", required: true },
  description: { type: "input", label: "Description", placeholder: "Description optionnelle" },
  month: { type: "input", label: "Mois", inputType: "number", required: true, defaultValue: new Date().getMonth() + 1 },
  year: { type: "input", label: "Année", inputType: "number", required: true, defaultValue: new Date().getFullYear() },
  targetValue: { type: "input", label: "Valeur Objectif (DT)", inputType: "number", required: true, defaultValue: 0 },
  warningThreshold: { type: "input", label: "Seuil d'alerte (%)", inputType: "number", defaultValue: 80 },
  notes: { type: "input", label: "Notes", placeholder: "Notes internes" },
};

function AddTargetPage() {
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.user?.user?.id || state.user?.user?._id || null);

  const handleSave = async (formValues) => {
    const result = await createTarget({ ...formValues, createdBy: currentUserId });
    if (result) {
      navigate("/objectifs", { state: { successMessage: "Objectif ajouté avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un objectif"
        fields={TARGET_FIELDS}
        fieldOrder={["name", "description", "month", "year", "targetValue", "warningThreshold", "notes"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/objectifs")}
      />
    </TemplateSelector>
  );
}

export default AddTargetPage;