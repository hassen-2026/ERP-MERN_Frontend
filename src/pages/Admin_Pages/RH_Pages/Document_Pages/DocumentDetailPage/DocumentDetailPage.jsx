import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrDocuments } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function DocumentDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const documentState = useSelector((state) => state.hr?.documents || {});
  const documents = documentState.items || [];

  useEffect(() => {
    if (!documents.length && !documentState.loading) dispatch(fetchHrDocuments());
  }, [dispatch, documents.length, documentState.loading]);

  const document = useMemo(() => documents.find((item) => String(item.id) === String(id)) || null, [documents, id]);

  const infoRows = [
    { label: "Employé", value: document?.employeeName || "-" },
    { label: "Titre", value: document?.title || "-" },
    { label: "Type", value: document?.documentTypeLabel || "-" },
    { label: "Émission", value: document?.issueDate || "-" },
    { label: "Expiration", value: document?.expirationDate || "-" },
    { label: "Statut", value: document?.statusLabel || "-" },
    { label: "Fichier", value: document?.fileUrl || "-" },
    { label: "Notes", value: document?.notes || "-" },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <PageHeader
          title={document ? `Document - ${document.title}` : "Détail document"}
          subtitle={document?.employeeName || ""}
          actions={[{ id: "back", label: "Retour", className: "p-supplier-toolbar-btn", onClick: () => navigate("/rh/documents") }]}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!documentState.loading && !document ? <div className="p-card p-supplier-page__state">Document introuvable.</div> : null}
        {document ? <Overview item={document} itemSectionTitle="Informations document" infoRows={infoRows} /> : null}
      </div>
    </TemplateSelector>
  );
}

export default DocumentDetailPage;
