import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "antd";

import TemplateSelector from "../../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import {
  deleteHrAttendanceThunk,
  fetchHrAttendances,
  fetchHrEmployees,
} from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierPage/SupplierPage.css";

function EmployeeAttendanceListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: employeeId } = useParams();
  const hrState = useSelector((state) => state.hr || {});
  const employeeState = hrState.employees || {};
  const attendanceState = hrState.attendances || {};
  const employees = employeeState.items || [];
  const attendances = attendanceState.items || [];

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get current employee info
  const currentEmployee = useMemo(() => {
    return employees.find((emp) => emp.id === employeeId);
  }, [employees, employeeId]);

  useEffect(() => {
    dispatch(fetchHrAttendances());
    dispatch(fetchHrEmployees());
  }, [dispatch]);

  // Filter attendances for this employee
  const filteredAttendances = useMemo(() => {
    const employeeAttendances = attendances.filter(
      (attendance) => attendance.employeeId === employeeId
    );

    const normalizedSearch = searchValue.trim().toLowerCase();

    return employeeAttendances.filter((attendance) => {
      const matchesStatus = !statusFilter || attendance.status === statusFilter;
      if (!matchesStatus) return false;

      if (!normalizedSearch) return true;

      const haystack = [
        attendance.attendanceDate,
        attendance.checkIn,
        attendance.checkOut,
        attendance.status,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [attendances, employeeId, searchValue, statusFilter]);

  const stats = useMemo(() => {
    const employeeAttendances = attendances.filter(
      (attendance) => attendance.employeeId === employeeId
    );
    const total = employeeAttendances.length;
    const present = employeeAttendances.filter(
      (att) => att.status === "PRESENT"
    ).length;
    const absent = employeeAttendances.filter(
      (att) => att.status === "ABSENT"
    ).length;

    return [
      {
        value: total,
        label: "Total Presences",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: present,
        label: "Present",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
      {
        value: absent,
        label: "Absent",
        containerClassName: "p-stat-card",
        defaultValueClassName: "p-stat-card__value",
        defaultLabelClassName: "p-stat-card__label",
      },
    ];
  }, [attendances, employeeId]);

  const filterFields = [
    {
      type: "input",
      id: "attendance-search",
      label: "Rechercher",
      placeholder: "Date, statut...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "attendance-status",
      label: "Statut",
      value: statusFilter || undefined,
      placeholder: "Tous les statuts",
      options: [
        { label: "Present", value: "PRESENT" },
        { label: "Absent", value: "ABSENT" },
        { label: "En conge", value: "ON_LEAVE" },
        { label: "Retard", value: "LATE" },
      ],
      onChange: (value) => setStatusFilter(value || ""),
    },
  ];

  const columns = [
    { key: "attendanceDate", header: "Date" },
    { key: "checkIn", header: "Heure entree" },
    { key: "checkOut", header: "Heure sortie" },
    { key: "status", header: "Statut" },
  ];

  const headerActions = [
    {
      id: "add-attendance",
      label: "+ Ajouter Presence",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate(`/rh/employees/${employeeId}/attendance/add`),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-supplier-page">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/rh/employees")}
            type="default"
            style={{ marginRight: "16px" }}
          >
            Retour
          </Button>
        </div>

        <PageHeader
          title={`Présences - ${currentEmployee?.fullName || "Employe"}`}
          subtitle={`Historique des présences pour l'employé ${currentEmployee?.employeeCode || ""}`}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats">
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-supplier-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Historique de presence"
          rows={filteredAttendances}
          columns={columns}
          getActions={(attendance) => [
            {
              id: `delete-${attendance.id}`,
              kind: "delete",
              onClick: async () => {
                if (
                  !window.confirm(
                    `Supprimer cette presence du ${attendance.date} ?`
                  )
                )
                  return;
                await dispatch(deleteHrAttendanceThunk(attendance.id));
              },
            },
          ]}
          loading={Boolean(attendanceState.loading)}
          error={attendanceState.error || ""}
          loadingMessage="Chargement des presences..."
          emptyMessage="Aucune presence enregistree."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getRowKey={(attendance, index) => attendance?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default EmployeeAttendanceListPage;
