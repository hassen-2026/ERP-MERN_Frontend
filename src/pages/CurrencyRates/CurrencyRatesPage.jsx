import { useEffect, useMemo, useState } from "react";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";

import TemplateSelector from "../../templates/TemplateSelector/TemplateSelector";
import Alert from "../../components/atoms/alert/Alert";
import StatCard from "../../components/molecules/StatCard/StatCard";
import InputField from "../../components/molecules/InputField/InputField";
import PageHeader from "../../components/organisms/PageHeader/PageHeader";
import FilterForm from "../../components/organisms/FilterForm/FilterForm";
import MainDataTable from "../../components/organisms/MainDataTable/MainDataTable";
import { getCurrencyRates, updateCurrencyRates } from "../../services/currencyRateApi";
import "../Admin_Pages/Product_Pages/ProductPage/ProductPage.css";
import "./CurrencyRatesPage.css";

const DEFAULT_CODES = ["TND", "EUR", "USD", "GBP", "CHF", "CAD"];

const normalizeCurrencyCode = (value) => {
  const normalized = String(value || "").trim().toUpperCase();

  if (normalized === "€") return "EUR";
  if (normalized === "$") return "USD";

  return normalized;
};

export default function CurrencyRatesPage() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCurrencyRates();
      const apiRates = Array.isArray(data) ? data : [];

      const map = new Map();
      apiRates.forEach((item) => {
        const code = normalizeCurrencyCode(item?.currencyCode);
        if (!code) return;
        map.set(code, {
          currencyCode: code,
          rateToTnd: Number(item?.rateToTnd || 0),
          isActive: item?.isActive !== false,
        });
      });

      DEFAULT_CODES.forEach((code) => {
        if (!map.has(code)) {
          map.set(code, {
            currencyCode: code,
            rateToTnd: code === "TND" ? 1 : 0,
            isActive: true,
          });
        }
      });

      setRates(Array.from(map.values()).sort((a, b) => a.currencyCode.localeCompare(b.currencyCode)));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur de chargement des taux");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleRateChange = (code, value) => {
    setRates((prev) => prev.map((item) => {
      if (item.currencyCode !== code) return item;
      const parsed = Number(String(value).replace(/,/g, "."));
      return {
        ...item,
        rateToTnd: Number.isFinite(parsed) ? parsed : 0,
      };
    }));
  };

  const handleToggleActive = (code, checked) => {
    setRates((prev) => prev.map((item) => {
      if (item.currencyCode !== code) return item;
      return { ...item, isActive: checked };
    }));
  };

  const canSave = useMemo(() => rates.every((rate) => {
    if (!rate.isActive) return true;
    return Number(rate.rateToTnd) > 0;
  }), [rates]);

  const stats = useMemo(() => {
    const activeCount = rates.filter((item) => item.isActive).length;
    const configuredCount = rates.filter((item) => Number(item.rateToTnd) > 0).length;
    const foreignActive = rates.filter((item) => item.currencyCode !== "TND" && item.isActive).length;

    return [
      { value: rates.length, label: "Devises", customClassName: "p-stat-card" },
      { value: activeCount, label: "Actives", customClassName: "p-stat-card" },
      { value: configuredCount, label: "Taux configurés", customClassName: "p-stat-card" },
      { value: foreignActive, label: "Devises étrangères actives", customClassName: "p-stat-card" },
    ];
  }, [rates]);

  const filteredRates = useMemo(() => {
    const normalizedSearch = searchValue.trim().toUpperCase();
    return rates.filter((item) => {
      const matchesSearch = !normalizedSearch || item.currencyCode.includes(normalizedSearch);
      const matchesFilter =
        activeFilter === "all"
          || (activeFilter === "active" && item.isActive)
          || (activeFilter === "inactive" && !item.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [rates, searchValue, activeFilter]);

  const filterFields = useMemo(() => ([
    {
      type: "input",
      id: "currency-search",
      label: "Rechercher devise",
      placeholder: "Ex: EUR, USD...",
      value: searchValue,
      onChange: (event) => setSearchValue(event.target.value),
    },
    {
      type: "select",
      id: "currency-active-filter",
      label: "Statut",
      value: activeFilter,
      options: [
        { label: "Toutes", value: "all" },
        { label: "Actives", value: "active" },
        { label: "Inactives", value: "inactive" },
      ],
      onChange: (value) => setActiveFilter(value),
    },
  ]), [searchValue, activeFilter]);

  const handleSave = async () => {
    if (!canSave) {
      setError("Chaque devise active doit avoir un taux strictement positif vers TND.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateCurrencyRates(
        rates.map((item) => ({
          currencyCode: normalizeCurrencyCode(item.currencyCode),
          rateToTnd: Number(item.rateToTnd || 0),
          isActive: item.isActive !== false,
        }))
      );

      setSuccess("Taux de change enregistrés avec succès.");
      await fetchRates();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur de sauvegarde des taux");
    } finally {
      setSaving(false);
    }
  };

  const headerActions = [
    {
      id: "currency-add-row",
      label: "Ajouter devise",
      icon: <PlusOutlined />,
      className: "p-currency-toolbar-btn p-currency-toolbar-btn--secondary",
      onClick: () => {
        setRates((prev) => {
          const nextCode = `NEW${prev.length + 1}`;
          return [
            ...prev,
            {
              currencyCode: nextCode,
              rateToTnd: 0,
              isActive: true,
            },
          ];
        });
      },
    },
    {
      id: "currency-save",
      label: saving ? "Enregistrement..." : "Enregistrer",
      icon: <SaveOutlined />,
      disabled: saving || loading,
      className: "p-currency-toolbar-btn p-currency-toolbar-btn--primary",
      onClick: handleSave,
    },
  ];

  const columns = [
    {
      key: "currencyCode",
      header: "Devise",
      render: (row) => (
        <InputField
          id={`currency-code-${row.currencyCode}`}
          label="Devise"
          value={row.currencyCode}
          customClassName="p-currency-page__cell-field"
          inputClassName="p-currency-page__control"
          labelClassName="p-currency-page__cell-label"
          inputProps={{ disabled: row.currencyCode === "TND" }}
          onChange={(event) => {
            const value = normalizeCurrencyCode(event.target.value);
            setRates((prev) => prev.map((item) => {
              if (item.currencyCode !== row.currencyCode) return item;
              return { ...item, currencyCode: value || item.currencyCode };
            }));
          }}
        />
      ),
    },
    {
      key: "rateToTnd",
      header: "Taux vers TND",
      render: (row) => (
        <InputField
          id={`currency-rate-${row.currencyCode}`}
          label="Taux vers TND"
          inputType="number"
          value={row.rateToTnd}
          customClassName="p-currency-page__cell-field"
          inputClassName="p-currency-page__control"
          labelClassName="p-currency-page__cell-label"
          inputProps={{ min: 0, step: 0.0001, disabled: row.currencyCode === "TND" }}
          onChange={(event) => handleRateChange(row.currencyCode, event.target.value)}
        />
      ),
    },
    {
      key: "isActive",
      header: "Active",
      render: (row) => (
        <input
          type="checkbox"
          checked={Boolean(row.isActive)}
          disabled={row.currencyCode === "TND"}
          onChange={(event) => handleToggleActive(row.currencyCode, event.target.checked)}
        />
      ),
    },
  ];

  return (
    <TemplateSelector>
      <div className="p-currency-page">
        {error ? <Alert type="error" message={error} showIcon /> : null}
        {success ? <Alert type="success" message={success} showIcon closable onClose={() => setSuccess("")} customClassName="p-currency-page__success-alert" /> : null}

        <PageHeader
          title="Parametres de conversion des monnaies"
          subtitle="Configurez les taux officiels pour convertir toutes les analyses et achats en TND."
          actions={headerActions}
          containerClassName="p-currency-page__header"
          titleClassName="p-currency-page__title"
          subtitleClassName="p-currency-page__subtitle"
          actionsClassName="p-currency-page__header-actions"
          defaultActionVariant="secondary"
        />

        <section className="p-dashboard__stats p-currency-page__stats">
          {stats.map((stat) => (
            <StatCard key={`${stat.label}-${stat.value}`} {...stat} />
          ))}
        </section>

        <FilterForm
          fields={filterFields}
          sectionClassName="p-card p-currency-page__filters"
          gridClassName="p-currency-page__filters-grid"
          fieldClassName="p-currency-page__field"
          controlClassName="p-currency-page__control"
          labelClassName="p-field__label"
        />

        <MainDataTable
          title="Taux de change"
          rows={filteredRates}
          columns={columns}
          loading={loading}
          error={error || ""}
          loadingMessage="Chargement des taux..."
          emptyMessage="Aucun taux de change disponible."
          sectionClassName="o-movements"
          titleClassName="o-movements__title"
          tableClassName="o-movements__table p-table p-currency-page__table"
          stateRowClassName="p-data-table__state"
          errorRowClassName="p-data-table__state--error"
          getRowKey={(row, index) => row?.currencyCode || index}
        />

        {!canSave ? (
          <Alert
            type="warning"
            message="Chaque devise active doit avoir un taux strictement positif vers TND avant enregistrement."
            showIcon
          />
        ) : null}
      </div>
    </TemplateSelector>
  );
}