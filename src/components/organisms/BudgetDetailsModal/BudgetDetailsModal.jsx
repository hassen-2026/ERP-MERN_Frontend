import { Modal, Progress, Tag } from "antd";

import StatCard from "../../molecules/StatCard/StatCard";

function BudgetDetailsModal(props) {
  const { open, budget, statuses, onClose } = props;

  const statusConfig = statuses.find((item) => item.value === budget?.status) || {};

  return (
    <Modal title="Détails du Budget" open={open} onCancel={onClose} footer={null} width={720} destroyOnClose>
      {budget ? (
        <div className="p-budget-page__details">
          <div className="p-budget-page__details-meta">
            <p><strong>Nom:</strong> {budget.name}</p>
            <p><strong>Période:</strong> {budget.month}/{budget.year}</p>
            <p><strong>Status:</strong> <Tag color={statusConfig.color}>{statusConfig.label || budget.status}</Tag></p>
            <p><strong>Créé par:</strong> {budget.createdBy?.firstName} {budget.createdBy?.lastName}</p>
            {budget.approvedBy ? <p><strong>Approuvé par:</strong> {budget.approvedBy?.firstName} {budget.approvedBy?.lastName}</p> : null}
          </div>

          <section className="p-budget-page__details-stats">
            <StatCard value={`${Number(budget.totalBudget || 0).toLocaleString("fr-TN")} DT`} label="Budget alloué" />
            <StatCard value={`${Number(budget.spent || 0).toLocaleString("fr-TN")} DT`} label="Dépensé" />
            <StatCard value={`${Number(budget.reserved || 0).toLocaleString("fr-TN")} DT`} label="Réservé" />
            <StatCard value={`${Number(budget.available || 0).toLocaleString("fr-TN")} DT`} label="Disponible" />
          </section>

          <div className="p-budget-page__details-progress">
            <p><strong>Utilisation</strong></p>
            <Progress percent={budget.percentageUsed || 0} format={(percent) => `${percent}% utilisé`} />
          </div>

          {budget.notes ? <p className="p-budget-page__details-notes"><strong>Notes:</strong> {budget.notes}</p> : null}
        </div>
      ) : null}
    </Modal>
  );
}

export default BudgetDetailsModal;