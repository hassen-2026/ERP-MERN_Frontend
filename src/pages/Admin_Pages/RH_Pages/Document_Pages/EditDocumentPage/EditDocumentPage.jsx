import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { fetchHrDocuments, fetchHrEmployees, updateHrDocumentThunk } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditDocumentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const documentState = useSelector((state) => state.hr?.documents || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const documents = documentState.items || [];
  const employees = employeeState.items || [];

  useEffect(() => {
    if (!documents.length && !documentState.loading) dispatch(fetchHrDocuments());
    if (!employees.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, documents.length, documentState.loading, employeeState.loading, employees.length]);

  const document = useMemo(() => documents.find((item) => String(item.id) === String(id)) || null, [documents, id]);
  const employeeOptions = useMemo(() => employees.map((item) => ({ label: item.fullName, value: item.id })), [employees]);

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrDocumentThunk(id, formValues));
    if (result?.success) navigate("/rh/documents", { state: { successMessage: "Document mis à jour avec succès." } });
  };

  return (
    <TemplateSelector>
      {!documentState.loading && !document ? <div className="p-card p-product-page__state">Document introuvable.</div> : null}
      {document ? (
        <EntityForm
          formTitle="Modifier un document"
          fields={{
            employeeId: { label: "Employé", placeholder: "Sélectionner un employé", type: "select", options: employeeOptions, defaultValue: document.employeeId || undefined },
            title: { label: "Titre", placeholder: "Titre du document", type: "input", inputType: "text", defaultValue: document.title || "" },
            documentType: { label: "Type", placeholder: "Sélectionner un type", type: "select", options: [{ label: "Contrat", value: "CONTRACT" }, { label: "CV", value: "CV" }, { label: "Certificat", value: "CERTIFICATE" }, { label: "Attestation", value: "ATTESTATION" }, { label: "Autre", value: "OTHER" }], defaultValue: document.documentType || "OTHER" },
            fileUrl: { label: "URL du fichier", placeholder: "Lien du document", type: "input", inputType: "text", defaultValue: document.fileUrl || "" },
            filePublicId: { label: "ID du fichier", placeholder: "Référence Cloudinary", type: "input", inputType: "text", defaultValue: document.filePublicId || "" },
            issueDate: { label: "Date d'émission", placeholder: "Date d'émission", type: "input", inputType: "date", defaultValue: document.issueDateIso ? String(document.issueDateIso).slice(0, 10) : "" },
            expirationDate: { label: "Date d'expiration", placeholder: "Date d'expiration", type: "input", inputType: "date", defaultValue: document.expirationDateIso ? String(document.expirationDateIso).slice(0, 10) : "" },
            status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Valide", value: "VALID" }, { label: "À vérifier", value: "PENDING" }, { label: "Expiré", value: "EXPIRED" }], defaultValue: document.status || "PENDING" },
            notes: { label: "Notes", placeholder: "Observations", type: "input", inputType: "text", defaultValue: document.notes || "" },
          }}
          initialValues={{
            employeeId: document.employeeId,
            title: document.title,
            documentType: document.documentType,
            fileUrl: document.fileUrl,
            filePublicId: document.filePublicId,
            issueDate: document.issueDateIso ? String(document.issueDateIso).slice(0, 10) : "",
            expirationDate: document.expirationDateIso ? String(document.expirationDateIso).slice(0, 10) : "",
            status: document.status,
            notes: document.notes,
          }}
          fieldOrder={["employeeId", "title", "documentType", "fileUrl", "filePublicId", "issueDate", "expirationDate", "status", "notes"]}
          actionLabels={{ save: "Mettre à jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/documents")}
          saveLoading={documentState.updating}
          saveError={documentState.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditDocumentPage;


