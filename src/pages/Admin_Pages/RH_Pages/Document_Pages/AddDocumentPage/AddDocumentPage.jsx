import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrDocumentThunk, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddDocumentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const documentState = useSelector((state) => state.hr?.documents || {});
  const employeeState = useSelector((state) => state.hr?.employees || {});
  const employees = employeeState.items || [];

  useEffect(() => {
    if (!employees.length && !employeeState.loading) dispatch(fetchHrEmployees());
  }, [dispatch, employeeState.loading, employees.length]);

  const employeeOptions = useMemo(() => employees.map((item) => ({ label: item.fullName, value: item.id })), [employees]);

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrDocumentThunk(formValues));
    if (result?.success) navigate("/rh/documents", { state: { successMessage: "Document ajouté avec succès." } });
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle="Ajouter un document"
        fields={{
          employeeId: { label: "Employé", placeholder: "Sélectionner un employé", type: "select", options: employeeOptions, defaultValue: undefined },
          title: { label: "Titre", placeholder: "Titre du document", type: "input", inputType: "text", defaultValue: "" },
          documentType: { label: "Type", placeholder: "Sélectionner un type", type: "select", options: [{ label: "Contrat", value: "CONTRACT" }, { label: "CV", value: "CV" }, { label: "Certificat", value: "CERTIFICATE" }, { label: "Attestation", value: "ATTESTATION" }, { label: "Autre", value: "OTHER" }], defaultValue: "OTHER" },
          fileUrl: { label: "URL du fichier", placeholder: "Lien du document", type: "input", inputType: "text", defaultValue: "" },
          filePublicId: { label: "ID du fichier", placeholder: "Référence Cloudinary", type: "input", inputType: "text", defaultValue: "" },
          issueDate: { label: "Date d'émission", placeholder: "Date d'émission", type: "input", inputType: "date", defaultValue: "" },
          expirationDate: { label: "Date d'expiration", placeholder: "Date d'expiration", type: "input", inputType: "date", defaultValue: "" },
          status: { label: "Statut", placeholder: "Sélectionner un statut", type: "select", options: [{ label: "Valide", value: "VALID" }, { label: "À vérifier", value: "PENDING" }, { label: "Expiré", value: "EXPIRED" }], defaultValue: "PENDING" },
          notes: { label: "Notes", placeholder: "Observations", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["employeeId", "title", "documentType", "fileUrl", "filePublicId", "issueDate", "expirationDate", "status", "notes"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/documents")}
        saveLoading={documentState.creating}
        saveError={documentState.createError}
      />
    </TemplateSelector>
  );
}

export default AddDocumentPage;


