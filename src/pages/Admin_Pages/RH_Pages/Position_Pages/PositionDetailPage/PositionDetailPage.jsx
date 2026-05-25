import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DashboardTemplate from "../../../../../templates/TemplateAdmin/TemplateAdmin";
import PageHeader from "../../../../../components/organisms/PageHeader/PageHeader";
import Overview from "../../../../../components/organisms/Overview/Overview";
import { fetchHrPositions, fetchHrEmployees } from "../../../../../redux/reducers/HrReducer";
import "../../../Supplier_Pages/SupplierDetailPage/SupplierDetailPage.css";

function PositionDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const hrState = useSelector((state) => state.hr || {});
  const positions = hrState.positions?.items || [];
  const employees = hrState.employees?.items || [];

  useEffect(() => {
    if (!positions.length) {
      dispatch(fetchHrPositions());
    }
    if (!employees.length) {
      dispatch(fetchHrEmployees());
    }
  }, [dispatch, positions.length, employees.length]);

  const position = useMemo(() => positions.find((p) => String(p.id) === String(id)) || null, [positions, id]);

  const positionEmployees = useMemo(() => employees.filter((e) => String(e.positionId) === String(id)), [employees, id]);

  const headerActions = [
    {
      id: "edit-position",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      onClick: () => navigate(`/rh/positions/${id}/edit`),
    },
    {
      id: "back-positions",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/rh/positions"),
    },
  ];

  const infoRows = [
    { label: "Titre", value: position?.title || "-" },
    { label: "Niveau", value: position?.level || "-" },
    { label: "Description", value: position?.description || "-" },
    { label: "Nombre d'Employes", value: positionEmployees.length },
    { label: "Cree le", value: position?.createdAt || "-" },
  ];

  return (
    <DashboardTemplate>
      <div className="p-supplier-page">
        <PageHeader
          title={`Poste - ${position?.title || "Detail Poste"}`}
          subtitle={position?.level || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!hrState.positions?.loading && !position ? (
          <div className="p-card p-supplier-page__state">Poste non trouve</div>
        ) : null}

        {position ? (
          <>
            <div className="p-card">
              <Overview title="Details du Poste" rows={infoRows} />
            </div>

            {positionEmployees.length > 0 && (
              <div className="p-card" style={{ marginTop: "24px" }}>
                <h3 style={{ marginTop: 0 }}>Employes avec ce Poste</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <th style={{ textAlign: "left", padding: "12px", fontWeight: 600 }}>Code</th>
                      <th style={{ textAlign: "left", padding: "12px", fontWeight: 600 }}>Nom</th>
                      <th style={{ textAlign: "left", padding: "12px", fontWeight: 600 }}>Departement</th>
                      <th style={{ textAlign: "left", padding: "12px", fontWeight: 600 }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positionEmployees.map((emp) => (
                      <tr key={emp.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "12px" }}>{emp.employeeCode}</td>
                        <td style={{ padding: "12px" }}>{emp.fullName}</td>
                        <td style={{ padding: "12px" }}>{emp.departmentName}</td>
                        <td style={{ padding: "12px" }}>
                          <span className={`p-pill ${emp.status === "ACTIVE" ? "p-pill--stock" : emp.status === "ON_LEAVE" ? "p-pill--warning" : "p-pill--danger"}`}>
                            {emp.statusLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardTemplate>
  );
}

export default PositionDetailPage;
