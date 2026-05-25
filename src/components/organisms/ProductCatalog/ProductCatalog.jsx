import React, { useMemo, useState } from "react";
import Input from "../../atoms/input/Input";
import Select from "../../atoms/select/Select";
import { SearchOutlined } from "@ant-design/icons";
import "./ProductCatalog.css";

const FALLBACK_PRODUCT_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='10' fill='%23eef1f5'/><g transform='translate(24 24)'><rect x='8' y='10' width='32' height='28' rx='3' fill='%23c18b5a'/><path d='M8 16l16 10 16-10' fill='none' stroke='%238a5a2b' stroke-width='2'/><path d='M24 26v12' stroke='%238a5a2b' stroke-width='2'/></g></svg>";

function ProductCatalog({ productsOptions = [], onAddProduct = () => {}, title = "Catalogue produits", emptyText = "Aucun produit trouve.", currencyCode = "TND" }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState("");

  const catalog = useMemo(() => (productsOptions || []).map((p, i) => ({
    value: String(p.value || ""),
    label: p.label || String(p.value || ""),
    name: String(p.label || p.value || "").split(" (")[0],
    category: p.category || "Sans categorie",
    price: Number(p.price ?? p.unitPrice ?? p.unitCost ?? 0),
    stock: Number(p.stockQuantity ?? p.stock ?? 0),
    imageUrl: p.imageUrl || p.avatar || "",
    id: p.id || `${i + 1}`,
  })), [productsOptions]);

  const categories = useMemo(() => [
    { label: "Toutes les categories", value: "all" },
    ...Array.from(new Set(catalog.map((c) => c.category))).map((c) => ({ label: c, value: c })),
  ], [catalog]);

  const filtered = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    return catalog.filter((p) => (category === "all" || p.category === category) && (!q || p.label.toLowerCase().includes(q)));
  }, [catalog, category, search]);

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString("fr-TN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencyCode}`;
  };

  return (
    <div className="p-product-catalog">
      <div className="p-product-catalog__header">
        <h4 className="p-product-catalog__title">{title}</h4>
        <div className="p-product-catalog__filters">
          <div className="p-product-catalog__search">
            <SearchOutlined className="p-product-catalog__search-icon" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." customClassName="p-product-catalog__search-input" />
          </div>
          <Select value={category} options={categories} onChange={setCategory} customClassName="p-product-catalog__category" />
        </div>
      </div>

      <div className="p-product-catalog__grid">
        {filtered.length ? filtered.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`p-product-catalog__card ${selectedProductId === p.value ? "p-product-catalog__card--active" : ""}`.trim()}
            onClick={() => {
              setSelectedProductId(p.value);
              onAddProduct(p);
            }}
          >
            <img
              src={p.imageUrl || FALLBACK_PRODUCT_IMAGE}
              alt={p.label}
              className="p-product-catalog__img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
            <div className="p-product-catalog__info">
              <strong className="p-product-catalog__name">{p.name || p.label}</strong>
              <div className="p-product-catalog__meta">
                <span>{formatMoney(p.price)}</span>
                <span>Stock {p.stock}</span>
              </div>
            </div>
          </button>
        )) : <div className="p-product-catalog__empty">{emptyText}</div>}
      </div>
    </div>
  );
}

export default ProductCatalog;
