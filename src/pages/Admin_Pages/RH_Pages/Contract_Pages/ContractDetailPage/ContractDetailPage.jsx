import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FilePdfOutlined } from "@ant-design/icons";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import Button from "../../../../../components/atoms/button/Button";
import { fetchHrContracts, fetchHrLeaves } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function ContractDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const contractState = hrState.contracts || {};
  const leaveState = hrState.leaves || {};
  const contracts = contractState.items || [];
  const leaves = leaveState.items || [];

  useEffect(() => {
    if (!contracts.length && !contractState.loading) {
      dispatch(fetchHrContracts());
    }
    if (!leaves.length && !leaveState.loading) {
      dispatch(fetchHrLeaves());
    }
  }, [contractState.loading, contracts.length, dispatch, leaveState.loading, leaves.length]);

  const contract = useMemo(() => contracts.find((c) => String(c.id) === String(id)) || null, [contracts, id]);
  const employeeContracts = useMemo(
    () => contracts.filter((item) => String(item.employeeId) === String(contract?.employeeId || "")),
    [contract?.employeeId, contracts],
  );
  const employeeLeaves = useMemo(
    () => leaves.filter((item) => String(item.employeeId) === String(contract?.employeeId || "")),
    [contract?.employeeId, leaves],
  );

  const contractColumns = [
    { key: "contractType", header: "Type" },
    { key: "startDate", header: "Début" },
    { key: "endDate", header: "Fin" },
    {
      key: "salaryBase",
      header: "Salaire",
      render: (row) => Number(row?.salaryBase || 0).toLocaleString("fr-FR", { style: "currency", currency: "TND" }),
    },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${row?.status === "ACTIVE" ? "p-pill--stock" : row?.status === "DRAFT" ? "p-pill--category" : "p-pill--danger"}`.trim()}
        >
          {row?.statusLabel || "-"}
        </span>
      ),
    },
  ];

  const leaveColumns = [
    { key: "leaveType", header: "Type" },
    { key: "startDate", header: "Début" },
    { key: "endDate", header: "Fin" },
    { key: "totalDays", header: "Jours" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => (
        <span
          className={`p-pill ${row?.status === "APPROVED" ? "p-pill--stock" : row?.status === "PENDING" ? "p-pill--warning" : "p-pill--danger"}`.trim()}
        >
          {row?.statusLabel || row?.status || "-"}
        </span>
      ),
    },
  ];

  const handleDownloadPdf = async () => {
    if (!contract?.pdfUrl) {
      alert("Aucun PDF disponible pour ce contrat.");
      return;
    }

    try {
      const resp = await fetch(contract.pdfUrl, { method: "GET" });
      if (!resp.ok) {
        alert(`Impossible de récupérer le PDF (status ${resp.status}).`);
        return;
      }
      const blob = await resp.blob();
      if (!blob || blob.size === 0) {
        alert("Le fichier PDF récupéré est vide.");
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contract_${contract?.employeeName || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download error:", err);
      alert("Erreur lors du téléchargement du PDF.");
    }
  };

  const headerActions = [
    {
      id: "edit-contract",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      onClick: () => navigate(`/rh/contracts/${id}/edit`),
    },
    {
      id: "back-contracts",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/rh/contracts"),
    },
  ];

  const infoRows = [
    { label: "Employe", value: contract?.employeeName || "-" },
    { label: "Type de Contrat", value: contract?.contractType || "-" },
    { label: "Statut", value: contract?.statusLabel || "-" },
    { label: "Date de Debut", value: contract?.startDate || "-" },
    { label: "Date de Fin", value: contract?.endDate || "-" },
    { label: "Salaire de Base", value: contract?.salaryBase ? `${contract.salaryBase} TND` : "-" },
    { label: "Mois de Probation", value: contract?.probationMonths || "0" },
    { label: "Notes", value: contract?.notes || "-" },
    { label: "Cree le", value: contract?.createdAt || "-" },
  ];

  const tableSections = [
    {
      title: "Contrats du même employé",
      rows: employeeContracts,
      columns: contractColumns,
      loading: Boolean(contractState.loading),
      error: contractState.error || "",
      loadingMessage: "Chargement des contrats...",
      emptyMessage: "Aucun autre contrat trouvé pour cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
    {
      title: "Congés du même employé",
      rows: employeeLeaves,
      columns: leaveColumns,
      loading: Boolean(leaveState.loading),
      error: leaveState.error || "",
      loadingMessage: "Chargement des congés...",
      emptyMessage: "Aucun congé trouvé pour cet employé.",
      sectionClassName: "p-table",
      tableClassName: "p-table",
      stateRowClassName: "p-supplier-page__state",
      errorRowClassName: "p-supplier-page__state--error",
      getRowKey: (row, index) => row?.id ?? index,
    },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={`Contrat - ${contract?.employeeName || "Detail Contrat"}`}
          subtitle={contract?.contractType || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!contractState?.loading && !contract ? (
          <div className="p-card p-supplier-page__state">Contrat non trouve</div>
        ) : null}

        {contract ? (
          <Overview
            item={contract}
            itemSectionTitle="Détails du contrat"
            infoRows={infoRows}
            infoExtraContent={contract?.pdfUrl ? (
              <div style={{ marginTop: "20px" }}>
                <Button variant="primary" icon={<FilePdfOutlined />} onClick={handleDownloadPdf} label="Télécharger PDF" />
              </div>
            ) : null}
            tableSections={tableSections}
            movementsContainerClassName="p-overview__movements-container"
          />
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default ContractDetailPage;
