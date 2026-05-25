import { Modal, Progress, Tag } from "antd";

import StatCard from "../../molecules/StatCard/StatCard";

function TargetDetailsModal(props) {
  const { open, target, statuses, onClose } = props;
  const statusConfig = statuses.find((item) => item.value === target?.status) || {};

  return (
    <Modal title="Détails de l'objectif" open={open} onCancel={onClose} footer={null} width={720} destroyOnClose>
      {target ? (
        <div className="p-target-page__details">
          <div className="p-target-page__details-meta">
            <p><strong>Nom:</strong> {target.name}</p>
            <p><strong>Période:</strong> {target.month}/{target.year}</p>
            <p><strong>Statut:</strong> <Tag color={statusConfig.color}>{statusConfig.label || target.status}</Tag></p>
            <p><strong>Créé par:</strong> {target.createdBy?.firstName} {target.createdBy?.lastName}</p>
          </div>

          <section className="p-target-page__details-stats">
            <StatCard value={`${Number(target.targetValue || 0).toLocaleString("fr-TN")} DT`} label="Objectif" />
            <StatCard value={`${Number(target.actualValue || 0).toLocaleString("fr-TN")} DT`} label="Réalisé" />
            <StatCard value={`${Number(target.remainingValue || 0).toLocaleString("fr-TN")} DT`} label="Restant" />
            <StatCard value={`${Number(target.progressPercentage || 0)}%`} label="Progression" />
          </section>

          <div className="p-target-page__details-progress">
            <p><strong>Avancement</strong></p>
            <Progress percent={target.progressPercentage || 0} format={(percent) => `${percent}% atteint`} />
          </div>

          {target.notes ? <p className="p-target-page__details-notes"><strong>Notes:</strong> {target.notes}</p> : null}
        </div>
      ) : null}
    </Modal>
  );
}

export default TargetDetailsModal;