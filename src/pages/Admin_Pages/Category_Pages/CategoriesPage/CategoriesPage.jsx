import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import { fetchCategoriesThunk, deleteCategoryThunk } from "../../../../redux/reducers/CategoriesReducer";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import StatCard from "../../../../components/molecules/StatCard/StatCard";

const CATEGORY_PAGE_DEFAULTS = {
  shellProps: {},
  statsClassName: "",
  statCardProps: {
    containerClassName: "p-stat-card",
    defaultValueClassName: "p-stat-card__value",
    defaultLabelClassName: "p-stat-card__label",
  },
};

function CategoriesPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shellProps,
    statsClassName,
    statCardProps,
  } = { ...CATEGORY_PAGE_DEFAULTS, ...props };
  
  const { items: categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const handleAdd = () => navigate("/categories/add");
  const handleEdit = (id) => navigate(`/categories/${id}/edit`);
  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      dispatch(deleteCategoryThunk(id));
    }
  };

  const headerActions = [
    {
      id: "add-category",
      label: "+ Ajouter catégorie",
      className: "p-product-toolbar-btn p-product-toolbar-btn--add",
      onClick: handleAdd,
    },
  ];

  const stats = useMemo(() => {
    const activeCount = categories?.filter((c) => c.isActive).length ?? 0;
    const inactiveCount = categories?.length - activeCount ?? 0;

    return [
      { value: categories?.length ?? 0, label: "Catégories totales", ...statCardProps },
      { value: activeCount, label: "Actives", ...statCardProps },
      { value: inactiveCount, label: "Inactives", ...statCardProps },
    ];
  }, [categories, statCardProps]);

  const columns = [
    {
      key: "avatar",
      header: "Image",
      render: (category) => (
        category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name || "Catégorie"}
            className="p-product-page__image"
            loading="lazy"
            style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="p-product-page__avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {String(category.avatar || "C").charAt(0)}
          </div>
        )
      ),
    },
    { key: "name", header: "Nom" },
    { key: "tvaRate", header: "TVA", render: (row) => `${(Number(row.tvaRate) * 100).toFixed(0)}%` },
    { key: "isActive", header: "Actif", render: (row) => (row.isActive ? "Oui" : "Non") },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-product-page">
        <PageHeader
          title="Catégories"
          subtitle="Gérer les catégories et leurs taux TVA"
          actions={headerActions}
          containerClassName="p-product-page__header"
          titleClassName="p-product-page__title"
          subtitleClassName="p-product-page__subtitle"
          actionsClassName="p-product-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className={`p-dashboard__stats ${statsClassName}`.trim()}>
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <MainDataTable
          title="Liste des catégories"
          rows={categories || []}
          columns={columns}
          loading={loading}
          error={error}
          loadingMessage="Chargement des catégories..."
          emptyMessage="Aucune catégorie disponible."
          tableClassName="o-movements__table p-table p-product-page__table"
          getActions={(category) => [
            { id: `edit-${category.id}`, kind: "edit", onClick: () => handleEdit(category.id) },
            { id: `delete-${category.id}`, kind: "delete", onClick: () => handleDelete(category.id) },
          ]}
          getRowKey={(row, index) => row?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default CategoriesPage;
