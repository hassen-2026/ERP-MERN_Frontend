import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrEvaluations } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function EvaluationDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const evaluationState = useSelector((state) => state.hr?.evaluations || {});
  const evaluations = evaluationState.items || [];

  useEffect(() => {
    if (!evaluations.length && !evaluationState.loading) dispatch(fetchHrEvaluations());
  }, [dispatch, evaluations.length, evaluationState.loading]);

  const evaluation = useMemo(() => evaluations.find((item) => String(item.id) === String(id)) || null, [evaluations, id]);

  const infoRows = [
    { label: "Employé", value: evaluation?.employeeName || "-" },
    { label: "Période", value: evaluation?.periodLabel || "-" },
    { label: "Date", value: evaluation?.evaluationDate || "-" },
    { label: "Score technique", value: evaluation?.technicalScore ?? 0 },
    { label: "Score comportement", value: evaluation?.behaviorScore ?? 0 },
    { label: "Score objectifs", value: evaluation?.goalScore ?? 0 },
    { label: "Score global", value: evaluation?.overallScore ?? 0 },
    { label: "Statut", value: evaluation?.statusLabel || "-" },
    { label: "Résumé", value: evaluation?.summary || "-" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title={evaluation ? `Évaluation - ${evaluation.employeeName}` : "Détail évaluation"}
          subtitle={evaluation?.periodLabel || ""}
          actions={[{ id: "back", label: "Retour", className: "p-supplier-toolbar-btn", onClick: () => navigate("/rh/evaluations") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!evaluationState.loading && !evaluation ? <div className="p-card p-supplier-page__state">Évaluation introuvable.</div> : null}
        {evaluation ? <Overview item={evaluation} itemSectionTitle="Informations évaluation" infoRows={infoRows} /> : null}
      </div>
    </TemplateSelector>
  );
}

export default EvaluationDetailPage;
