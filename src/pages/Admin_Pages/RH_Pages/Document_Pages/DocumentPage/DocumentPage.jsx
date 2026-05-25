import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import { deleteHrDocumentThunk, fetchHrDocuments, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function DocumentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const documentState = useSelector((state) => state.hr?.documents || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const documents = documentState.items || [];
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchHrDocuments());
    if (!employeeState.items?.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, employeeState.items?.length, employeeState.loading]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    return documents.filter((document) => {
      if (typeFilter && document.documentType !== typeFilter) return false;
      if (statusFilter && document.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      const haystack = [document.employeeName, document.title, document.documentTypeLabel, document.statusLabel, document.notes].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [documents, searchValue, typeFilter, statusFilter]);

  const stats = useMemo(() => [
    { value: documents.length, label: "Documents", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: documents.filter((item) => item.status === "VALID").length, label: "Valides", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
    { value: documents.filter((item) => item.status === "EXPIRED").length, label: "Expirés", containerClassName: "p-stat-card", defaultValueClassName: "p-stat-card__value", defaultLabelClassName: "p-stat-card__label" },
  ], [documents]);

  const columns = [
    { key: "employeeName", header: "Employé" },
    { key: "title", header: "Titre" },
    { key: "documentTypeLabel", header: "Type" },
    { key: "issueDate", header: "Émission" },
    { key: "expirationDate", header: "Expiration" },
    {
      key: "statusLabel",
      header: "Statut",
      render: (row) => <span className={`p-pill ${row.status === "EXPIRED" ? "p-pill--danger" : row.status === "PENDING" ? "p-pill--warning" : "p-pill--stock"}`.trim()}>{row.statusLabel}</span>,
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title="Gestion RH - Documents"
          subtitle="Contrats, attestations, dossiers et pièces administratives."
          actions={[{ id: "add-document", label: "+ Ajouter Document", className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add", icon: <PlusOutlined />, onClick: () => navigate("/rh/documents/add") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats">
          {stats.map((stat) => <StatCard key={`${stat.label}-${stat.value}`} {...stat} />)}
        </section>

        <FilterForm
          fields={[
            { type: "input", id: "document-search", label: "Rechercher", placeholder: "Employé, titre, type...", value: searchValue, onChange: (event) => setSearchValue(event.target.value) },
            { type: "select", id: "document-type", label: "Type", value: typeFilter || undefined, placeholder: "Tous les types", options: [{ label: "Contrat", value: "CONTRACT" }, { label: "CV", value: "CV" }, { label: "Certificat", value: "CERTIFICATE" }, { label: "Attestation", value: "ATTESTATION" }, { label: "Autre", value: "OTHER" }], onChange: (value) => setTypeFilter(value || "") },
            { type: "select", id: "document-status", label: "Statut", value: statusFilter || undefined, placeholder: "Tous les statuts", options: [{ label: "Valide", value: "VALID" }, { label: "À vérifier", value: "PENDING" }, { label: "Expiré", value: "EXPIRED" }], onChange: (value) => setStatusFilter(value || "") },
          ]}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des documents"
          rows={filteredDocuments}
          columns={columns}
          getActions={(document) => [
            { id: `detail-${document.id}`, label: "Détail", icon: <EyeOutlined />, variant: "primary", onClick: () => navigate(`/rh/documents/${document.id}/detail`) },
            { id: `edit-${document.id}`, kind: "edit", onClick: () => navigate(`/rh/documents/${document.id}/edit`) },
            { id: `delete-${document.id}`, kind: "delete", onClick: async () => { if (!window.confirm(`Supprimer le document ${document.title} ?`)) return; await dispatch(deleteHrDocumentThunk(document.id)); } },
          ]}
          loading={Boolean(documentState.loading)}
          error={documentState.error || documentState.deleteError || ""}
          loadingMessage="Chargement des documents..."
          emptyMessage="Aucun document disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default DocumentPage;
