import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import SupplierOverview from "../../../../components/organisms/SupplierOverview/SupplierOverview";
import { SUPPLIER_DETAIL_PAGE_DEFAULTS } from "../defaults/supplierDetailPage_default";
import { fetchSuppliers } from "../../../../redux/reducers/SuppliersReducer";
import { fetchAchats } from "../../../../redux/reducers/AchatsReducer";
import "./SupplierDetailPage.css";

function SupplierDetailPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shellProps, notFoundMessage, infoRows } = { ...SUPPLIER_DETAIL_PAGE_DEFAULTS, ...props };

  const suppliersState = useSelector((state) => state.suppliers);
  const achatsState = useSelector((state) => state.achats);

  useEffect(() => {
    if (!suppliersState?.items?.length && !suppliersState?.loading) {
      dispatch(fetchSuppliers());
    }

    if (!achatsState?.items?.length && !achatsState?.loading) {
      dispatch(fetchAchats());
    }
  }, [
    dispatch,
    suppliersState?.items?.length,
    suppliersState?.loading,
    achatsState?.items?.length,
    achatsState?.loading,
  ]);

  const supplier = useMemo(
    () => suppliersState?.items?.find((item) => String(item.id) === String(id)) || null,
    [id, suppliersState?.items],
  );

  const supplierAchats = useMemo(() => {
    if (!supplier) {
      return [];
    }

    const supplierId = String(supplier.id || supplier._id || "");

    return (achatsState?.items || [])
      .filter((achat) => String(achat.supplierId || "") === supplierId)
      .sort((firstAchat, secondAchat) => {
        const firstDate = new Date(firstAchat.dateIso || firstAchat.createdAt || 0).getTime();
        const secondDate = new Date(secondAchat.dateIso || secondAchat.createdAt || 0).getTime();

        return secondDate - firstDate;
      });
  }, [achatsState?.items, supplier]);

  const headerActions = [
    {
      id: "edit-supplier",
      label: "Modifier",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--bulk",
      onClick: () => navigate(`/suppliers/${id}/edit`),
    },
    {
      id: "back-suppliers",
      label: "Retour",
      className: "p-supplier-toolbar-btn",
      onClick: () => navigate("/suppliers"),
    },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-supplier-page">
        <PageHeader
          title={supplier?.fullName || "Détail Fournisseur"}
          subtitle={supplier?.email || ""}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {!suppliersState?.loading && !supplier ? (
          <div className="p-card p-supplier-page__state">{notFoundMessage}</div>
        ) : null}

        {supplier ? (
          <SupplierOverview
            supplier={supplier}
            movementsSectionTitle="Achats Récents"
            infoRows={infoRows}
            movements={supplierAchats}
            movementsLoading={achatsState?.loading}
            movementsError={achatsState?.error}
          />
        ) : null}
      </div>
    </TemplateSelector>
  );
}

export default SupplierDetailPage;
