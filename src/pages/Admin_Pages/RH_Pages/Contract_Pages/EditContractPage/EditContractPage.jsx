import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  fetchHrContracts,
  fetchHrEmployees,
  updateHrContractThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditContractPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const employeeState = useSelector((state) => state.hr?.employees || {});
  const contractState = useSelector((state) => state.hr?.contracts || {});
  const employees = employeeState.items || [];
  const contracts = contractState.items || [];

  useEffect(() => {
    if (!employees.length && !employeeState.loading) {
      dispatch(fetchHrEmployees());
    }
    if (!contracts.length && !contractState.loading) {
      dispatch(fetchHrContracts());
    }
  }, [dispatch, employees.length, employeeState.loading, contracts.length, contractState.loading]);

  const employeeOptions = useMemo(
    () => employees.map((item) => ({ label: item.fullName, value: item.id })),
    [employees],
  );

  const contract = useMemo(
    () => contracts.find((item) => String(item.id) === String(id)) || null,
    [contracts, id],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrContractThunk(id, formValues));

    if (result?.success) {
      navigate("/rh/contracts", { state: { successMessage: "Contrat mis a jour avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      {!contractState.loading && !contract ? (
        <div className="p-card p-product-page__state">Contrat introuvable.</div>
      ) : null}

      {contract ? (
        <EntityForm
          formTitle="Modifier un contrat"
          fields={{
            employeeId: {
              label: "Employe",
              placeholder: "Selectionner un employe",
              type: "select",
              options: employeeOptions,
              defaultValue: contract.employeeId || undefined,
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
              defaultValue: contract.contractType || "CDI",
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
              defaultValue: contract.status || "ACTIVE",
            },
            startDate: {
              label: "Date debut",
              placeholder: "Date debut",
              type: "input",
              inputType: "date",
              defaultValue: contract.startDateIso ? String(contract.startDateIso).slice(0, 10) : "",
            },
            endDate: {
              label: "Date fin",
              placeholder: "Date fin",
              type: "input",
              inputType: "date",
              defaultValue: contract.endDateIso ? String(contract.endDateIso).slice(0, 10) : "",
            },
            salaryBase: {
              label: "Salaire base",
              placeholder: "0",
              type: "input",
              inputType: "number",
              defaultValue: contract.salaryBase ?? 0,
            },
            probationMonths: {
              label: "Mois probation",
              placeholder: "0",
              type: "input",
              inputType: "number",
              defaultValue: contract.probationMonths ?? 0,
            },
            notes: {
              label: "Notes",
              placeholder: "Informations complementaires",
              type: "input",
              inputType: "text",
              defaultValue: contract.notes || "",
            },
            pdf: {
              label: "Nouveau PDF (optionnel)",
              placeholder: "Selectionner un fichier PDF",
              type: "input",
              inputType: "file",
              defaultValue: "",
            },
          }}
          initialValues={{
            employeeId: contract.employeeId,
            contractType: contract.contractType,
            status: contract.status,
            startDate: contract.startDateIso ? String(contract.startDateIso).slice(0, 10) : "",
            endDate: contract.endDateIso ? String(contract.endDateIso).slice(0, 10) : "",
            salaryBase: contract.salaryBase ?? 0,
            probationMonths: contract.probationMonths ?? 0,
            notes: contract.notes || "",
            pdf: null,
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
          actionLabels={{ save: "Mettre a jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/contracts")}
          saveLoading={contractState.updating}
          saveError={contractState.updateError}
        />
      ) : null}
    </DashboardTemplate>
  );
}

export default EditContractPage;


