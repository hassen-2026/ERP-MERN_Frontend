import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined, FilePdfOutlined, FileExcelOutlined, SwapOutlined } from "@ant-design/icons";

import TemplateSelector from "../../../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../../../components/atoms/alert/Alert";
import StatCard from "../../../../components/molecules/StatCard/StatCard";
import FilterForm from "../../../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../../../components/organisms/MainDataTable/MainDataTable";
import PageHeader from "../../../../components/organisms/PageHeader/PageHeader";
import { PRODUCT_PAGE_DEFAULTS } from "../defaults/productPage_default";
import { fetchProducts } from "../../../../redux/reducers/ProductsReducer";
import "./ProductPage.css";

function ProductPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    shellProps,
    title,
    subtitle,
    filters,
    stockOptions,
    statsClassName,
    statCardProps,
  } = { ...PRODUCT_PAGE_DEFAULTS, ...props };

  const headerActions = [
    {
      id: "add-product",
      label: "+ Ajouter Produit",
      className: "p-product-toolbar-btn p-product-toolbar-btn--add",
      icon: <PlusOutlined />,
      onClick: () => navigate("/product/add"),
      allowedRoles: ["ADMIN", "PROCUREMENT_MANAGER"],
    },
    {
      id: "init-price",
      label: "Init Prix",
      className: "p-product-toolbar-btn p-product-toolbar-btn--init",
      icon: <EditOutlined />,
      onClick: () => {},
    },
    {
      id: "bulk-price",
      label: "Bulk Prix",
      className: "p-product-toolbar-btn p-product-toolbar-btn--bulk",
      icon: <SwapOutlined />,
      onClick: () => {},
    },
    {
      id: "export-pdf",
      label: "PDF",
      className: "p-product-toolbar-btn p-product-toolbar-btn--pdf",
      icon: <FilePdfOutlined />,
      onClick: () => {},
    },
    {
      id: "export-excel",
      label: "Excel",
      className: "p-product-toolbar-btn p-product-toolbar-btn--excel",
      icon: <FileExcelOutlined />,
      onClick: () => {},
    },
  ];

  const { items: products, loading, error } = useSelector((state) => state.products);
  const [searchValue, setSearchValue] = useState(filters.search.value);
  const [categoryValue, setCategoryValue] = useState(filters.category.value);
  const [stockValue, setStockValue] = useState(filters.stock.value);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
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

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(products.map((product) => product.category).filter((category) => category && category !== "-")),
    );

    return [
      { label: "Toutes les catégories", value: "all" },
      ...categories.map((category) => ({ label: category, value: category })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.description, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory = categoryValue === "all" || product.category === categoryValue;
      const matchesStock =
        stockValue === "all" ||
        (stockValue === "in_stock" && product.stockStatus === "success") ||
        (stockValue === "low_stock" && product.stockStatus === "warning") ||
        (stockValue === "out_of_stock" && product.stockStatus === "danger");

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [categoryValue, products, searchValue, stockValue]);

  const stats = useMemo(() => {
    const categoryCount = new Set(products.map((product) => product.category)).size;
    const catalogueValue = products
      .reduce((sum, product) => sum + (Number(product.sellPriceValue) || 0), 0)
      .toLocaleString("fr-FR");

    return [
      { value: products.length, label: "Produits actifs", ...statCardProps },
      { value: categoryCount, label: "Catégories", ...statCardProps },
      { value: catalogueValue, label: "Valeur catalogue", ...statCardProps },
    ];
  }, [products, statCardProps]);

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "product-search",
      label: "Rechercher",
      placeholder: filters.search.placeholder,
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "product-category",
      label: "Catégorie",
      value: categoryValue,
      options: categoryOptions,
      onChange: (value) => setCategoryValue(value),
    },
    {
      type: "select",
      id: "product-stock",
      label: "Stock",
      value: stockValue,
      options: stockOptions,
      onChange: (value) => setStockValue(value),
    },
  ]), [categoryOptions, categoryValue, filters.search.placeholder, searchValue, stockOptions, stockValue]);

  const columns = [
    {
      key: "avatar",
      header: "Image",
      render: (product) => (
        product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name || "Produit"}
            className="p-product-page__image"
            loading="lazy"
          />
        ) : (
          <div className="p-product-page__avatar">{String(product.avatar || "?").charAt(0)}</div>
        )
      ),
    },
    { key: "name", header: "Nom" },
    { key: "reference", header: "Référence" },
    { key: "description", header: "Description" },
    {
      key: "category",
      header: "Catégorie",
      render: (product) => <span className="p-pill p-pill--category">{product.category}</span>,
    },
    {
      key: "tvaRate",
      header: "TVA",
      render: (product) => `${(product.tvaRate * 100).toFixed(2)}%`,
    },
    { key: "buyPrice", header: "Prix d'achat HTVA" },
    {
      key: "buyPriceTTC",
      header: "Prix d'achat TTC",
      render: (product) => `${Number(product.buyPriceTTC || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`,
    },
    { key: "sellPrice", header: "Prix de vente HTVA" },
    {
      key: "sellPriceTTC",
      header: "Prix de vente TTC",
      render: (product) => `${Number(product.sellPriceTTC || 0).toLocaleString("fr-TN", { style: "currency", currency: "TND" })}`,
    },
    {
      key: "stock",
      header: "Stock",
      render: (product) => {
        const stockClassName =
          product.stockStatus === "warning"
            ? "p-pill--warning"
            : product.stockStatus === "danger"
              ? "p-pill--danger"
              : "p-pill--stock";

        return <span className={`p-pill ${stockClassName}`.trim()}>{product.stock}</span>;
      },
    },
  ];

  return (
    <TemplateSelector {...shellProps}>
      <div className="p-product-page">
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          containerClassName="p-product-page__header"
          titleClassName="p-product-page__title"
          subtitleClassName="p-product-page__subtitle"
          actionsClassName="p-product-page__header-actions"
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
          sectionClassName="p-card p-product-page__filters"
          gridClassName="p-product-page__filters-grid"
          fieldClassName="p-product-page__field"
          controlClassName="p-product-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Liste des produits"
          rows={filteredProducts}
          columns={columns}
          loading={loading}
          error={error}
          loadingMessage="Chargement des produits..."
          emptyMessage="Aucun produit disponible."
          tableClassName="o-movements__table p-table p-product-page__table"
          getActions={(product) => [
            {
              id: `view-${product.id}`,
              kind: "view",
              onClick: () => navigate(`/product/${product.id}`),
            },
            {
              id: `edit-${product.id}`,
              kind: "edit",
              onClick: () => navigate(`/product/${product.id}/edit`),
            },
          ]}
          getRowKey={(product, index) => product?.id ?? index}
        />
      </div>
    </TemplateSelector>
  );
}

export default ProductPage;
