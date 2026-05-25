import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import EntityForm from "../../../../../components/organisms/EntityForm/EntityForm";
import {
  fetchHrDepartments,
  fetchHrEmployees,
  fetchHrPositions,
  updateHrEmployeeThunk,
} from "../../../../../redux/reducers/HrReducer";
import "../../../../../components/organisms/EntityForm/EntityForm.css";

function EditEmployeePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const departments = hrState.departments?.items || [];
  const positions = hrState.positions?.items || [];

  useEffect(() => {
    if (!employeeState.items?.length && !employeeState.loading) {
      dispatch(fetchHrEmployees());
    }
    dispatch(fetchHrDepartments());
    dispatch(fetchHrPositions());
  }, [dispatch, employeeState.items?.length, employeeState.loading]);

  const employee = useMemo(
    () => employeeState.items.find((item) => String(item.id) === String(id)) || null,
    [employeeState.items, id],
  );

  const departmentOptions = useMemo(
    () => departments.map((item) => ({ label: item.name, value: item.id })),
    [departments],
  );

  const positionOptions = useMemo(
    () => positions.map((item) => ({ label: `${item.title}${item.level && item.level !== "-" ? ` (${item.level})` : ""}`, value: item.id })),
    [positions],
  );

  const handleSave = async (formValues) => {
    const result = await dispatch(updateHrEmployeeThunk(id, formValues));

    if (result?.success) {
      navigate("/rh/employees", { state: { successMessage: "Employe mis a jour avec succes." } });
    }
  };

  return (
    <TemplateSelector>
      {!employeeState.loading && !employee ? (
        <div className="p-card p-product-page__state">Employe introuvable.</div>
      ) : null}

      {employee ? (
        <EntityForm
          formTitle="Modifier un employe"
          fields={{
            image: { label: "Photo", placeholder: "Photo", type: "input", inputType: "file", defaultValue: null },
            cin: { label: "CIN", placeholder: "Numero CIN", type: "input", inputType: "text", defaultValue: employee.cin === "-" ? "" : employee.cin },
            firstName: { label: "Prenom", placeholder: "Prenom", type: "input", inputType: "text", defaultValue: employee.firstName || "" },
            lastName: { label: "Nom", placeholder: "Nom", type: "input", inputType: "text", defaultValue: employee.lastName || "" },
            gender: {
              label: "Genre",
              placeholder: "Selectionner un genre",
              type: "select",
              options: [
                { label: "Homme", value: "MALE" },
                { label: "Femme", value: "FEMALE" },
          
              ],
              defaultValue: employee.gender === "-" ? "" : employee.gender,
            },
            birthDate: {
              label: "Date de naissance",
              placeholder: "Date de naissance",
              type: "input",
              inputType: "date",
              defaultValue: employee.birthDateIso ? String(employee.birthDateIso).slice(0, 10) : "",
            },
            nationality: {
              label: "Nationalite",
              placeholder: "Nationalite",
              type: "input",
              inputType: "text",
              defaultValue: employee.nationality === "-" ? "" : employee.nationality,
            },
            email: { label: "Email", placeholder: "email@entreprise.com", type: "input", inputType: "text", defaultValue: employee.email || "" },
            phone: { label: "Telephone", placeholder: "+216 ...", type: "input", inputType: "text", defaultValue: employee.phone || "" },
            status: {
              label: "Statut",
              placeholder: "Selectionner un statut",
              type: "select",
              options: [
                { label: "Actif", value: "ACTIVE" },
                { label: "Inactif", value: "INACTIVE" },
                { label: "En conge", value: "ON_LEAVE" },
                { label: "Termine", value: "TERMINATED" },
              ],
              defaultValue: employee.status || "ACTIVE",
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
              defaultValue: employee.contractType || "CDI",
            },
            departmentId: {
              label: "Departement",
              placeholder: "Selectionner un departement",
              type: "select",
              options: departmentOptions,
              defaultValue: employee.departmentId || undefined,
            },
            positionId: {
              label: "Poste",
              placeholder: "Selectionner un poste",
              type: "select",
              options: positionOptions,
              defaultValue: employee.positionId || undefined,
            },
            hireDate: {
              label: "Date embauche",
              placeholder: "Date embauche",
              type: "input",
              inputType: "date",
              defaultValue: employee.hireDateIso ? String(employee.hireDateIso).slice(0, 10) : "",
            },
          }}
          initialValues={{
            cin: employee.cin === "-" ? "" : employee.cin,
            firstName: employee.firstName,
            lastName: employee.lastName,
            gender: employee.gender,
            birthDate: employee.birthDateIso ? String(employee.birthDateIso).slice(0, 10) : "",
            nationality: employee.nationality,
            email: employee.email,
            phone: employee.phone,
            status: employee.status,
            contractType: employee.contractType,
            departmentId: employee.departmentId,
            positionId: employee.positionId,
            hireDate: employee.hireDateIso ? String(employee.hireDateIso).slice(0, 10) : "",
          }}
          fieldOrder={[
            "image",
            "cin",
            "firstName",
            "lastName",
            "gender",
            "birthDate",
            "nationality",
            "email",
            "phone",
            "status",
            "contractType",
            "departmentId",
            "positionId",
            "hireDate",
          ]}
          actionLabels={{ save: "Mettre a jour", cancel: "Annuler" }}
          onSave={handleSave}
          onCancel={() => navigate("/rh/employees")}
          saveLoading={employeeState.updating}
          saveError={employeeState.updateError}
        />
      ) : null}
    </TemplateSelector>
  );
}

export default EditEmployeePage;


