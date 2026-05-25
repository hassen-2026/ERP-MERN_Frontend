import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import TemplateSelector from "../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../components/organisms/EntityForm/EntityForm";
import { useBudgetOperations } from "../../../redux/hooks/useBudget";

const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(window.atob(padded));
  } catch (_error) {
    return null;
  }
};

const BUDGET_FIELDS = {
  name: { type: "input", label: "Nom", placeholder: "Ex: Budget Achats Janvier 2026", required: true },
  description: { type: "input", label: "Description", placeholder: "Description optionnelle" },
  month: { type: "input", label: "Mois", inputType: "number", required: true, defaultValue: new Date().getMonth() + 1 },
  year: { type: "input", label: "Année", inputType: "number", required: true, defaultValue: new Date().getFullYear() },
  totalBudget: { type: "input", label: "Montant Budget (DT)", inputType: "number", required: true, defaultValue: 0 },
  warningThreshold: { type: "input", label: "Seuil d'alerte (%)", inputType: "number", defaultValue: 80 },
  notes: { type: "input", label: "Notes", placeholder: "Notes internes" },
};

function AddBudgetPage() {
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.user?.user?.id || state.user?.user?._id || state.user?.user?.userId || null)
    || decodeJwtPayload(localStorage.getItem("token"))?.id
    || decodeJwtPayload(localStorage.getItem("token"))?._id
    || null;
  const { createBudget, creating, createError } = useBudgetOperations();

  const handleSave = async (formValues) => {
    const result = await createBudget({
      ...formValues,
      createdBy: currentUserId,
    });

    if (result) {
      navigate("/budgets", { state: { successMessage: "Budget ajouté avec succès." } });
    }
  };

  const handleCancel = () => {
    navigate("/budgets");
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un budget"
        fields={BUDGET_FIELDS}
        fieldOrder={["name", "description", "month", "year", "totalBudget", "warningThreshold", "notes"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={handleCancel}
        saveLoading={creating}
        saveError={createError}
        customClassName="p-budget-page__entity-form"
      />
    </TemplateSelector>
  );
}

export default AddBudgetPage;