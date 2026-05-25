import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  createHrContractThunk,
  fetchHrEmployees,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddContractPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employeeState = useSelector((state) => state.hr?.employees || {});
  const contractState = useSelector((state) => state.hr?.contracts || {});
  const employees = employeeState.items || [];

  useEffect(() => {
    dispatch(fetchHrEmployees());
  }, [dispatch]);

  const employeeOptions = useMemo(
    () => employees.map((item) => ({ label: item.fullName, value: item.id })),
    [employees],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrContractThunk(formValues));
    if (result?.success) {
      navigate("/rh/contracts", { state: { successMessage: "Contrat ajoute avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter un contrat"
        fields={{
          employeeId: {
            label: "Employe",
            placeholder: "Selectionner un employe",
            type: "select",
            options: employeeOptions,
            defaultValue: undefined,
          },
          contractType: {
            label: "Type contrat",
            placeholder: "Selectionner un type",
            type: "select",
            options: [
              { label: "CDI", value: "CDI" },
              { label: "CDD", value: "CDD" },
              { label: "Stage", value: "STAGE" },
              { label: "Interim", value: "INTERIM" },
              { label: "Freelance", value: "FREELANCE" },
            ],
            defaultValue: "CDI",
          },
          status: {
            label: "Statut",
            placeholder: "Selectionner un statut",
            type: "select",
            options: [
              { label: "Brouillon", value: "DRAFT" },
              { label: "Actif", value: "ACTIVE" },
              { label: "Termine", value: "ENDED" },
              { label: "Resilie", value: "TERMINATED" },
            ],
            defaultValue: "ACTIVE",
          },
          startDate: { label: "Date debut", placeholder: "Date debut", type: "input", inputType: "date", defaultValue: "" },
          endDate: { label: "Date fin", placeholder: "Date fin", type: "input", inputType: "date", defaultValue: "" },
          salaryBase: { label: "Salaire base", placeholder: "0", type: "input", inputType: "number", defaultValue: 0 },
          probationMonths: { label: "Mois probation", placeholder: "0", type: "input", inputType: "number", defaultValue: 0 },
          notes: { label: "Notes", placeholder: "Informations complementaires", type: "input", inputType: "text", defaultValue: "" },
          pdf: { label: "Fichier PDF du contrat", placeholder: "Selectionner un fichier PDF", type: "input", inputType: "file", defaultValue: "" },
        }}
        fieldOrder={[
          "employeeId",
          "contractType",
          "status",
          "startDate",
          "endDate",
          "salaryBase",
          "probationMonths",
          "notes",
          "pdf",
        ]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/contracts")}
        saveLoading={contractState.creating}
        saveError={contractState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddContractPage;


