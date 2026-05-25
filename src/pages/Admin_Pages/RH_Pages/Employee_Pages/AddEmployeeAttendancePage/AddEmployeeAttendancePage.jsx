import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import { createHrAttendanceThunk, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function AddEmployeeAttendancePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: employeeId } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const employees = employeeState.items || [];

  useEffect(() => {
    dispatch(fetchHrEmployees());
  }, [dispatch]);

  const currentEmployee = useMemo(() => employees.find((e) => e.id === employeeId), [employees, employeeId]);

  const handleSave = async (formValues) => {
    // Map AddProduct fields to API payload
    // combine date + time into full ISO datetime for checkIn/checkOut
    const date = formValues.attendanceDate || null;
    const makeDateTime = (d, t) => {
      if (!d || !t) return null;
      // ensure seconds present
      const normalizedTime = t.length === 5 ? `${t}:00` : t;
      return `${d}T${normalizedTime}`;
    };

    const payload = {
      employeeId,
      attendanceDate: date,
      checkIn: makeDateTime(date, formValues.checkIn),
      checkOut: makeDateTime(date, formValues.checkOut),
      status: formValues.status || null,
    };

    const result = await dispatch(createHrAttendanceThunk(payload));
    if (result?.success) {
      navigate(`/rh/employees/${employeeId}/attendances`);
    }
  };

  return (
    <TemplateSelector>
      <EntityForm
        formTitle={`Ajouter Presence - ${currentEmployee?.fullName || "Employe"}`}
        fields={{
          attendanceDate: { label: "Date", placeholder: "Date", type: "input", inputType: "date", defaultValue: "" },
          checkIn: { label: "Heure entree", placeholder: "Heure entree", type: "input", inputType: "time", defaultValue: "" },
          checkOut: { label: "Heure sortie", placeholder: "Heure sortie", type: "input", inputType: "time", defaultValue: "" },
          status: { label: "Statut", placeholder: "Statut (optionnel)", type: "select", options: [
            { label: "Present", value: "PRESENT" },
            { label: "Absent", value: "ABSENT" },
            { label: "En conge", value: "ON_LEAVE" },
            { label: "Retard", value: "LATE" },
          ], defaultValue: undefined },
        }}
        fieldOrder={["attendanceDate", "checkIn", "checkOut", "status"]}
        actionLabels={{ save: "Ajouter Presence", cancel: "Annuler" }}
        onSave={handleSave}
        onCancel={() => navigate(`/rh/employees/${employeeId}/attendances`)}
      />
    </TemplateSelector>
  );
}

export default AddEmployeeAttendancePage;


