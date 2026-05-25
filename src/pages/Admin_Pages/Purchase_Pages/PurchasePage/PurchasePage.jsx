import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FileExcelOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { PURCHASE_PAGE_DEFAULTS } from "../defaults/purchasePage_default";
import {
  deleteAchatThunk,
  fetchAchats,
  receiveAchatThunk,
} from "../../../../redux/reducers/AchatsReducer";
import "../../Product_Pages/ProductPage/ProductPage.css";
import "./PurchasePage.css";

function PurchasePage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    shellProps,
    title,
    subtitle,
    filters,
    statusOptions,
    statsClassName,
    statCardProps,
  } = { ...PURCHASE_PAGE_DEFAULTS, ...props };

  const achatsState = useSelector((state) => state.achats || {});
  const achats = achatsState?.items || [];
  const roleFromStore = useSelector((state) => state.user?.user?.role || state.user?.user?.type || "USER");
  const normalizedRole = String(roleFromStore || "USER").trim().toUpperCase();
  const canManageAchats = ["ADMIN", "PROCUREMENT_MANAGER"].includes(normalizedRole);
  const canOpenPurchaseDetail = ["ADMIN", "PROCUREMENT_MANAGER", "LOGISTICS_MANAGER"].includes(normalizedRole);
  const canReceiveAchats = ["ADMIN", "PROCUREMENT_MANAGER", "LOGISTICS_MANAGER"].includes(normalizedRole);

  const [searchValue, setSearchValue] = useState(filters.search.value);
  const [statusValue, setStatusValue] = useState(filters.status.value);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAchats());
  }, [dispatch]);

  useEffect(() => {
    const incomingMessage = location.state?.successMessage;

    if (!incomingMessage) {
      return;
    }

    setSuccessMessage(incomingMessage);
    navigate(location.pathname, { replace: true, state: {} });

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 4500);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  const headerActions = [
    {
      id: "add-purchase",
      label: "+ Ajouter Achat",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/achats/add"),
      allowedRoles: ["ADMIN", "PROCUREMENT_MANAGER"],
    },
    {
      id: "export-pdf",
      label: "PDF",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--pdf",
      icon: <FilePdfOutlined />,
      onClick: () => {},
    },
    {
      id: "export-excel",
      label: "Excel",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--excel",
      icon: <FileExcelOutlined />,
      onClick: () => {},
    },
  ];

  const handleDelete = async (achat) => {
    const confirmed = window.confirm(`Supprimer l'achat ${achat.purchaseNumber} ?`);

    if (!confirmed) {
      return;
    }

    await dispatch(deleteAchatThunk(achat.id));
  };

  const handleReceive = async (achat) => {
    const confirmed = window.confirm(`Marquer l'achat ${achat.purchaseNumber} comme recu ?`);

    if (!confirmed) {
      return;
    }

    await dispatch(receiveAchatThunk(achat.id));
  };

  const filteredAchats = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return achats.filter((achat) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          achat.purchaseNumber,
          achat.supplierName,
          achat.createdByName,
          achat.supplierEmail,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus = statusValue === "all" || achat.status === statusValue;

      return matchesSearch && matchesStatus;
    });
  }, [achats, searchValue, statusValue]);

  const stats = useMemo(() => {
    const pendingCount = achats.filter((achat) => achat.status === "PENDING").length;
    const receivedCount = achats.filter((achat) => achat.status === "RECEIVED").length;
    const totalAmount = achats.reduce((sum, achat) => sum + (Number(achat.totalAmountValue) || 0), 0);

    return [
      { value: pendingCount, label: "En attente", ...statCardProps },
      { value: receivedCount, label: "Recus", ...statCardProps },
      {
        value: totalAmount.toLocaleString("fr-TN", { style: "currency", currency: "TND" }),
        label: "Montant total",
        ...statCardProps,
      },
    ];
  }, [achats, statCardProps]);

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "achat-search",
      label: "Rechercher",
      placeholder: filters.search.placeholder,
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "achat-status",
      label: "Statut",
      value: statusValue,
      options: statusOptions,
      onChange: (value) => setStatusValue(value),
    },
  ]), [filters.search.placeholder, searchValue, statusOptions, statusValue]);

  const columns = [
    { key: "purchaseNumber", header: "Numero" },
    { key: "supplierName", header: "Fournisseur" },
    { key: "date", header: "Date" },
    {
      key: "status",
      header: "Statut",
      render: (achat) => {
        const statusClass =
          achat.status === "RECEIVED"
            ? "p-pill--stock"
            : achat.status === "CANCELLED"
              ? "p-pill--danger"
              : "p-pill--warning";

        return <span className={`p-pill ${statusClass}`.trim()}>{achat.statusLabel}</span>;
      },
    },
    { key: "itemCount", header: "Articles" },
    { key: "totalAmount", header: "Montant" },
    { key: "createdByName", header: "Cree par" },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-supplier-page p-purchase-page">
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          containerClassName="p-supplier-page__header"
          titleClassName="p-supplier-page__title"
          subtitleClassName="p-supplier-page__subtitle"
          actionsClassName="p-supplier-page__header-actions"
          defaultActionVariant="secondary"
        />

        {successMessage ? (
          <Alert
            customClassName="p-product-page__success-alert"
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => setSuccessMessage("")}
          />
        ) : null}

        <section className={`p-dashboard__stats ${statsClassName}`.trim()}>
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-supplier-page__filters"
          gridClassName="p-purchase-page__filters-grid"
          fieldClassName="p-supplier-page__field"
          controlClassName="p-supplier-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des achats"
          rows={filteredAchats}
          columns={columns}
          loading={Boolean(achatsState?.loading)}
          error={achatsState?.error || achatsState?.receiveError || achatsState?.deleteError || ""}
          loadingMessage="Chargement des achats..."
          emptyMessage="Aucun achat disponible."
          tableClassName="o-movements__table p-table p-purchase-page__table"
          getActions={(achat) => [
            ...(canOpenPurchaseDetail
              ? [
                  {
                    id: `view-${achat.id}`,
                    kind: "view",
                    onClick: () => navigate(`/achats/${achat.id}`),
                  },
                ]
              : []),
            ...(canManageAchats
              ? [
                  {
                    id: `edit-${achat.id}`,
                    kind: "edit",
                    onClick: () => navigate(`/achats/${achat.id}/edit`),
                  },
                ]
              : []),
            ...(canReceiveAchats
              ? [
                  {
                    id: `receive-${achat.id}`,
                    kind: "receive",
                    label: "Recu",
                    disabled: achat.status === "RECEIVED" || Boolean(achatsState?.receiving),
                    onClick: () => handleReceive(achat),
                  },
                ]
              : []),
            ...(canManageAchats
              ? [
                  {
                    id: `delete-${achat.id}`,
                    kind: "delete",
                    onClick: () => handleDelete(achat),
                  },
                ]
              : []),
          ]}
          getRowKey={(achat, index) => achat?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default PurchasePage;
