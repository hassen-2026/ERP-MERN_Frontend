import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilePdfOutlined, PlusOutlined, StopOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import {
  deleteHrContractThunk,
  fetchHrContracts,
  updateHrContractThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function ContractPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contractState = useSelector((state) => state.hr?.contracts || {});
  const contracts = contractState.items || [];
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchHrContracts());
  }, [dispatch]);

  const handleDelete = async (contract) => {
    const confirmed = window.confirm(
      `Supprimer le contrat de ${contract.employeeName} ? (Le statut de l'employe deviendra inactif)`
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteHrContractThunk(contract.id));
  };

  const handleTerminate = async (contract) => {
    if (contract.status === "TERMINATED") {
      alert("Ce contrat est déjà résilié.");
      return;
    }

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir résilier le contrat de ${contract.employeeName} ? (Le statut de l'employe deviendra inactif)`
    );

    if (!confirmed) {
      return;
    }

    await dispatch(updateHrContractThunk(contract.id, { status: "TERMINATED" }));
  };

  // Debug logging
  useEffect(() => {
    // Removed debug logging
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) return contracts;

    return contracts.filter((contract) => {
      const haystack = [contract.employeeName, contract.contractType, contract.status].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [contracts, searchValue]);

  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter((contract) => contract.status === "ACTIVE").length;
    const ended = contracts.filter((contract) => contract.status === "ENDED" || contract.status === "TERMINATED").length;

    return [
      {
        value: total,
        label: "Contrats",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: active,
        label: "Actifs",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: ended,
        label: "Termines",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ];
  }, [contracts]);

  const columns = [
    { key: "employeeName", header: "Employe" },
    { key: "contractType", header: "Type" },
    {
      key: "status",
      header: "Statut",
      render: (contract) => {
        const statusClass =
          contract.status === "ACTIVE"
            ? "p-pill--stock"
            : contract.status === "TERMINATED"
              ? "p-pill--danger"
              : contract.status === "ENDED"
                ? "p-pill--warning"
                : "p-pill--default";
        return <span className={`p-pill ${statusClass}`.trim()}>{contract.statusLabel || contract.status}</span>;
      },
    },
    { key: "salaryBase", header: "Salaire base" },
    { key: "startDate", header: "Debut" },
    { key: "endDate", header: "Fin" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Contrats"
          subtitle="Consultez les contrats des employes."
          actions={[
            {
              id: "add-contract",
              label: "+ Ajouter Contrat",
              className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
              icon: <PlusOutlined />,
              onClick: () => navigate("/rh/contracts/add"),
            },
          ]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats">
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={[
            {
              type: "input",
              id: "contract-search",
              label: "Rechercher",
              placeholder: "Employe, type, statut...",
              value: searchValue,
              onChange: (event) => setSearchValue(event.target.value),
            },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des contrats"
          rows={filteredContracts}
          columns={columns}
          getActions={(contract) => [
            {
              id: `detail-${contract.id}`,
              label: "Detail",
              icon: <EyeOutlined />,
              variant: "primary",
              onClick: () => navigate(`/rh/contracts/${contract.id}/detail`),
            },
            {
              id: `view-pdf-${contract.id}`,
              label: "PDF",
              icon: <FilePdfOutlined />,
              variant: "primary",
              disabled: !contract?.pdfUrl,
              onClick: async () => {
                if (!contract?.pdfUrl) return;
                try {
                  const resp = await fetch(contract.pdfUrl, { method: "GET" });
                  if (!resp.ok) {
                    alert(`Impossible de récupérer le PDF (status ${resp.status}).`);
                    return;
                  }
                  const blob = await resp.blob();
                  if (!blob || blob.size === 0) {
                    alert("Le fichier PDF récupéré est vide. Vérifiez l'URL ou la configuration serveur.");
                    return;
                  }
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Contract_${(contract?.employeeName || "document")}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  console.error("PDF Download error:", err);
                  alert("Erreur lors du téléchargement du PDF: " + (err?.message || err));
                }
              },
            },
            {
              id: `terminate-${contract.id}`,
              label: "Résilier",
              icon: <StopOutlined />,
              variant: "warning",
              disabled: contract.status === "TERMINATED",
              onClick: () => handleTerminate(contract),
            },
            {
              id: `edit-${contract.id}`,
              kind: "edit",
              onClick: () => navigate(`/rh/contracts/${contract.id}/edit`),
            },
            {
              id: `delete-${contract.id}`,
              kind: "delete",
              onClick: () => handleDelete(contract),
            },
          ]}
          loading={Boolean(contractState.loading)}
          error={contractState.error || ""}
          loadingMessage="Chargement des contrats..."
          emptyMessage="Aucun contrat disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(contract, index) => contract?.id ?? index}
        />
      </div>
    </DashboardTemplate>
  );
}

export default ContractPage;
