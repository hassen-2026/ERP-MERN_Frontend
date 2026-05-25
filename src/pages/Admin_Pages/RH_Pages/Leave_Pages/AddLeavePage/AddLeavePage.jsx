import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  createHrLeaveThunk,
  fetchHrEmployees,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function AddLeavePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employeeState = useSelector((state) => state.hr?.employees || {});
  const leaveState = useSelector((state) => state.hr?.leaves || {});
  const employees = employeeState.items || [];

  useEffect(() => {
    dispatch(fetchHrEmployees());
  }, [dispatch]);

  const employeeOptions = useMemo(
    () => employees.map((item) => ({ label: item.fullName, value: item.id })),
    [employees],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(createHrLeaveThunk(formValues));
    if (result?.success) {
      navigate("/rh/leaves", { state: { successMessage: "Demande de conge ajoutee avec succes." } });
    }
  };

  return (
    <DashboardTemplate>
      <EntityForm
        formTitle="Ajouter une demande de conge"
        fields={{
          employeeId: {
            label: "Employe",
            placeholder: "Selectionner un employe",
            type: "select",
            options: employeeOptions,
            defaultValue: undefined,
          },
          leaveType: {
            label: "Type conge",
            placeholder: "Selectionner un type",
            type: "select",
            options: [
              { label: "Annuel", value: "ANNUAL" },
              { label: "Maladie", value: "SICK" },
              { label: "Sans solde", value: "UNPAID" },
              { label: "Maternite", value: "MATERNITY" },
              { label: "Paternite", value: "PATERNITY" },
              { label: "Autre", value: "OTHER" },
            ],
            defaultValue: "ANNUAL",
          },
          startDate: { label: "Date debut", placeholder: "Date debut", type: "input", inputType: "date", defaultValue: "" },
          endDate: { label: "Date fin", placeholder: "Date fin", type: "input", inputType: "date", defaultValue: "" },
          reason: { label: "Motif", placeholder: "Motif du conge", type: "input", inputType: "text", defaultValue: "" },
        }}
        fieldOrder={["employeeId", "leaveType", "startDate", "endDate", "reason"]}
        actionLabels={{ save: "Enregistrer", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate("/rh/leaves")}
        saveLoading={leaveState.creating}
        saveError={leaveState.createError}
      />
    </DashboardTemplate>
  );
}

export default AddLeavePage;


