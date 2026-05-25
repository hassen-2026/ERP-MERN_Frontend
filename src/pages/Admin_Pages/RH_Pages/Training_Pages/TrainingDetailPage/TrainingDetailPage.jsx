import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrTrainings } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function TrainingDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const trainingState = useSelector((state) => state.hr?.trainings || {});
  const trainings = trainingState.items || [];

  useEffect(() => {
    if (!trainings.length && !trainingState.loading) dispatch(fetchHrTrainings());
  }, [dispatch, trainings.length, trainingState.loading]);

  const training = useMemo(() => trainings.find((item) => String(item.id) === String(id)) || null, [trainings, id]);

  const infoRows = [
    { label: "Titre", value: training?.title || "-" },
    { label: "Organisme", value: training?.provider || "-" },
    { label: "Début", value: training?.startDate || "-" },
    { label: "Fin", value: training?.endDate || "-" },
    { label: "Participants", value: training?.participantsCount ?? 0 },
    { label: "Budget", value: training?.budget ?? 0 },
    { label: "Statut", value: training?.statusLabel || "-" },
    { label: "Résumé", value: training?.summary || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={training ? `Formation - ${training.title}` : "Détail formation"}
          subtitle={training?.provider || ""}
          actions={[{ id: "back", label: "Retour", className: "p-supplier-toolbar-btn", onClick: () => navigate("/rh/trainings") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!trainingState.loading && !training ? <div className="p-card p-supplier-page__state">Formation introuvable.</div> : null}
        {training ? <Overview item={training} itemSectionTitle="Informations formation" infoRows={infoRows} /> : null}
      </div>
    </DashboardTemplate>
  );
}

export default TrainingDetailPage;
