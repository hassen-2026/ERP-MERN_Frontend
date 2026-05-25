import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FileExcelOutlined, FilePdfOutlined, PlusOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { SUPPLIER_PAGE_DEFAULTS } from "../defaults/supplierPage_default";
import { deleteSupplierThunk, fetchSuppliers } from "../../../../redux/reducers/SuppliersReducer";
import "./SupplierPage.css";

function SupplierPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shellProps,
    title,
    subtitle,
    filters,
    statsClassName,
    statCardProps,
  } = { ...SUPPLIER_PAGE_DEFAULTS, ...props };

  const { items: suppliers, loading, error } = useSelector((state) => state.suppliers || {});
  const roleFromStore = useSelector((state) => state.user?.user?.role || state.user?.user?.type || "USER");
  const normalizedRole = String(roleFromStore || "USER").trim().toUpperCase();
  const canViewOrEditSupplier = ["ADMIN", "PROCUREMENT_MANAGER"].includes(normalizedRole);
  const canDeleteSupplier = ["ADMIN", "PROCUREMENT_MANAGER"].includes(normalizedRole);
  const [searchValue, setSearchValue] = useState(filters.search.value);

  const handleDelete = async (supplier) => {
    const confirmed = window.confirm(`Supprimer le fournisseur ${supplier.fullName} ?`);

    if (!confirmed) {
      return;
    }

    await dispatch(deleteSupplierThunk(supplier.id));
  };

  const headerActions = [
    {
      id: "add-supplier",
      label: "+ Ajouter Fournisseur",
      className: "p-supplier-toolbar-btn p-supplier-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/suppliers/add"),
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

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return suppliers || [];
    }

    return (suppliers || []).filter((supplier) => {
      const haystack = [
        supplier.fullName,
        supplier.email,
        supplier.phone,
        supplier.matriculeFiscale,
        supplier.address,
        supplier.city,
        supplier.country,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [suppliers, searchValue]);

  const stats = useMemo(() => {
    const totalSuppliers = (suppliers || []).length;
    const cityCount = new Set(
      (suppliers || [])
        .map((supplier) => String(supplier?.city || "").trim())
        .filter((city) => city && city !== "-")
        .map((city) => city.toLowerCase()),
    ).size;

    const countryCount = new Set(
      (suppliers || [])
        .map((supplier) => String(supplier?.country || "").trim())
        .filter((country) => country && country !== "-")
        .map((country) => country.toLowerCase()),
    ).size;

    return [
      { value: totalSuppliers, label: "Fournisseurs", ...statCardProps },
      { value: cityCount, label: "Villes", ...statCardProps },
      { value: countryCount, label: "Pays", ...statCardProps },
    ];
  }, [suppliers, statCardProps]);

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "supplier-search",
      label: "Rechercher",
      placeholder: filters.search.placeholder,
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
  ]), [filters.search.placeholder, searchValue]);

  const columns = [
    { key: "fullName", header: "Nom complet" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Téléphone" },
    { key: "matriculeFiscale", header: "Matricule Fiscale" },
    { key: "city", header: "Ville" },
    { key: "country", header: "Pays" },
    { key: "address", header: "Adresse" },
    { key: "createdAt", header: "Créé le" },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-supplier-page">
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

        <section className={`p-dashboard__stats ${statsClassName}`.trim()}>
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
          title="Liste des fournisseurs"
          rows={filteredSuppliers}
          columns={columns}
          loading={Boolean(loading)}
          error={error || ""}
          loadingMessage="Chargement des fournisseurs..."
          emptyMessage="Aucun fournisseur disponible."
          tableClassName="o-movements__table p-table p-supplier-page__table"
          getActions={(supplier) => [
            ...(canViewOrEditSupplier
              ? [
                  {
                    id: `view-${supplier.id}`,
                    kind: "view",
                    onClick: () => navigate(`/suppliers/${supplier.id}`),
                  },
                  {
                    id: `edit-${supplier.id}`,
                    kind: "edit",
                    onClick: () => navigate(`/suppliers/${supplier.id}/edit`),
                  },
                ]
              : []),
            ...(canDeleteSupplier
              ? [
                  {
                    id: `delete-${supplier.id}`,
                    kind: "delete",
                    onClick: () => handleDelete(supplier),
                  },
                ]
              : []),
          ]}
          getRowKey={(supplier, index) => supplier?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default SupplierPage;
