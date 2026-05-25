import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../components/organisms/EntityForm/EntityForm";
import { useAllBudgets, useBudgetOperations } from "../../../redux/hooks/useBudget";

const BUDGET_FIELDS = {
  name: { type: "input", label: "Nom", placeholder: "Ex: Budget Achats Janvier 2026", required: true },
  description: { type: "input", label: "Description", placeholder: "Description optionnelle" },
  month: { type: "input", label: "Mois", inputType: "number", required: true },
  year: { type: "input", label: "Année", inputType: "number", required: true },
  totalBudget: { type: "input", label: "Montant Budget (DT)", inputType: "number", required: true },
  warningThreshold: { type: "input", label: "Seuil d'alerte (%)", inputType: "number" },
  notes: { type: "input", label: "Notes", placeholder: "Notes internes" },
};

function EditBudgetPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { budgets, loading, error, fetchBudgets } = useAllBudgets();
  const { updateBudget, updating, updateError } = useBudgetOperations();

  useEffect(() => {
    if (!budgets?.length && !loading) {
      fetchBudgets();
    }
  }, [budgets?.length, fetchBudgets, loading]);

  const budget = useMemo(
    () => (budgets || []).find((item) => String(item._id) === String(id)) || null,
    [budgets, id],
  );

  const initialValues = useMemo(() => {
    if (!budget) return null;

    return {
      name: budget.name || "",
      description: budget.description || "",
      month: budget.month || new Date().getMonth() + 1,
      year: budget.year || new Date().getFullYear(),
      totalBudget: budget.totalBudget || 0,
      warningThreshold: budget.warningThreshold ?? 80,
      notes: budget.notes || "",
    };
  }, [budget]);

  const handleSave = async (formValues) => {
    const result = await updateBudget(id, formValues);

    if (result) {
      navigate("/budgets", { state: { successMessage: "Budget mis à jour avec succès." } });
    }
  };

  const handleCancel = () => {
    navigate("/budgets");
  };

  return (
    <TemplateSelector>
      {loading && !budget ? <div className="p-card p-product-page__state">Chargement du budget...</div> : null}
      {!loading && error ? <div className="p-card p-product-page__state">{error}</div> : null}
      {!loading && !error && !budget ? <div className="p-card p-product-page__state">Budget introuvable.</div> : null}
      {budget ? (
        <EntityForm
          formTitle="Modifier le budget"
          fields={BUDGET_FIELDS}
            fieldOrder={["name", "description", "month", "year", "totalBudget", "warningThreshold", "notes"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          initialValues={initialValues}
          onSave={handleSave}
          onCancel={handleCancel}
          saveLoading={updating}
          saveError={updateError}
          customClassName="p-budget-page__entity-form"
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditBudgetPage;