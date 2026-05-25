import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../components/organisms/EntityForm/EntityForm";
import { getAllTargets, updateTarget } from "../../../services/targetApi";

const TARGET_FIELDS = {
  name: { type: "input", label: "Nom", placeholder: "Ex: Objectif Achats Janvier 2026", required: true },
  description: { type: "input", label: "Description", placeholder: "Description optionnelle" },
  month: { type: "input", label: "Mois", inputType: "number", required: true },
  year: { type: "input", label: "Année", inputType: "number", required: true },
  targetValue: { type: "input", label: "Valeur Objectif (DT)", inputType: "number", required: true },
  warningThreshold: { type: "input", label: "Seuil d'alerte (%)", inputType: "number" },
  notes: { type: "input", label: "Notes", placeholder: "Notes internes" },
};

function EditTargetPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const response = await getAllTargets();
        setTargets(Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);
      } finally {
        setLoading(false);
      }
    };

    loadTargets();
  }, []);

  const target = useMemo(() => (targets || []).find((item) => String(item._id) === String(id)) || null, [targets, id]);

  const initialValues = useMemo(() => {
    if (!target) return null;
    return {
      name: target.name || "",
      description: target.description || "",
      month: target.month || new Date().getMonth() + 1,
      year: target.year || new Date().getFullYear(),
      targetValue: target.targetValue || 0,
      warningThreshold: target.warningThreshold ?? 80,
      notes: target.notes || "",
    };
  }, [target]);

  const handleSave = async (formValues) => {
    const result = await updateTarget(id, formValues);
    if (result) {
      navigate("/objectifs", { state: { successMessage: "Objectif mis à jour avec succès." } });
    }
  };

  return (
    <TemplateSelector>
      {loading && !target ? <div className="p-card p-product-page__state">Chargement de l'objectif...</div> : null}
      {!loading && !target ? <div className="p-card p-product-page__state">Objectif introuvable.</div> : null}
      {target ? (
        <EntityForm
          formTitle="Modifier l'objectif"
          fields={TARGET_FIELDS}
          fieldOrder={["name", "description", "month", "year", "targetValue", "warningThreshold", "notes"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          initialValues={initialValues}
          onSave={handleSave}
            onCancel={() => navigate("/objectifs")}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditTargetPage;