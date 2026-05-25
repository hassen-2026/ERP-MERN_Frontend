import apiClient from "./apiClient";
import { buildDualLineSeries } from "../utils/chartAggregation";

/**
 * Dashboard API service - Aggregates data for role-based dashboards
 */

const normalizeCollection = (response) => {
  const result = response.data?.data || response.data || [];
  console.log('[normalizeCollection] Raw response:', response);
  console.log('[normalizeCollection] Normalized result:', result);
  return result;
};

const toNumber = (value) => Number(value || 0);

const getAchatTotalTnd = (achat) => {
  const exchangeRate = Number(achat?.exchangeRateToTnd || 0);
  const originalTotal = Number(achat?.originalCurrencyTotals?.totalAmountTTC || 0);
  const explicitTnd = Number(achat?.totalAmountTND || 0);
  const currentTotal = Number(achat?.totalAmountTTC || achat?.totalAmount || achat?.montantTotal || achat?.total || 0);
  const currencyCode = String(achat?.currencyCode || "TND").toUpperCase();

  if (Number.isFinite(explicitTnd) && explicitTnd > 0) return explicitTnd;

  if (currencyCode !== "TND" && Number.isFinite(exchangeRate) && exchangeRate > 0 && Number.isFinite(originalTotal) && originalTotal > 0) {
    return Number((originalTotal * exchangeRate).toFixed(3));
  }

  return Number.isFinite(currentTotal) ? currentTotal : 0;
};

const resolveEntityId = (record, fieldNames) => {
  for (const fieldName of fieldNames) {
    const value = record?.[fieldName];
    if (!value) continue;

    if (typeof value === "object") {
      if (value._id) return String(value._id);
      if (value.id) return String(value.id);
    }

    return String(value);
  }

  return "";
};

const resolveEntityLabel = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;

  // Prefer obvious name-like fields
  const tryFields = [
    "name",
    "nom",
    "raisonSociale",
    "raison_sociale",
    "companyName",
    "company_name",
    "label",
    "displayName",
    "fullName",
    "denomination",
  ];

  for (const f of tryFields) {
    if (value[f]) return String(value[f]);
  }

  // If supplier stored as person with first/last name
  if (value.firstName || value.lastName) {
    return `${value.firstName || ""} ${value.lastName || ""}`.trim();
  }

  // Fallback to id if available
  if (value._id) return String(value._id);
  if (value.id) return String(value.id);

  return "";
};

const resolveCategoryLabel = (product) => {
  const categoryValue = product?.categoryId || product?.category || product?.categorie;
  const label = resolveEntityLabel(categoryValue);
  if (label) return label;

  if (typeof product?.categorie === "string" && product.categorie.trim()) {
    return product.categorie.trim();
  }

  if (product?.categoryId && typeof product.categoryId === "object") {
    return (
      product.categoryId.name ||
      product.categoryId.nom ||
      product.categoryId.label ||
      product.categoryId.displayName ||
      ""
    );
  }

  return "Autres";
};

const buildTurnoverSeries = ({ records, entities, relationKeys, amountKeys, fallbackLabel }) => {
  const turnoverByEntity = new Map();

  entities.forEach((entity) => {
    const entityId = String(entity?._id || entity?.id || "");
    if (!entityId) return;

    turnoverByEntity.set(entityId, {
      id: entityId,
      name: resolveEntityLabel(entity) || fallbackLabel,
      value: 0,
    });
  });

  records.forEach((record) => {
    const relationValue = relationKeys.map((key) => record?.[key]).find((value) => value !== undefined && value !== null);
    const relationId = resolveEntityId(record, relationKeys);

    // Try to resolve a human friendly label for the related entity.
    // Priority: explicit relation value (object with name), entity map (populated list), fallback to string value or fallbackLabel.
    let relationLabel = resolveEntityLabel(relationValue);
    if (!relationLabel && relationId) {
      // If entities list contains this id, prefer that entity's label
      const matchedEntity = entities.find((e) => String(e?._id || e?.id || "") === String(relationId));
      if (matchedEntity) relationLabel = resolveEntityLabel(matchedEntity);
    }
    // Last attempt: some records may store supplierName / fournisseur / nom directly
    if (!relationLabel) {
      relationLabel = record.supplierName || record.fournisseur || record.nom || record.name || "";
    }
    const amount = amountKeys.reduce((sum, key) => sum + toNumber(record?.[key]), 0);
    const entityKey = relationId || relationLabel;

    if (!entityKey) return;

    if (!turnoverByEntity.has(entityKey)) {
      turnoverByEntity.set(entityKey, {
        id: entityKey,
        name: relationLabel || fallbackLabel,
        value: 0,
      });
    }

    const entry = turnoverByEntity.get(entityKey);
    entry.name = entry.name || relationLabel || fallbackLabel;
    entry.value += amount;
  });

  return Array.from(turnoverByEntity.values()).sort((left, right) => right.value - left.value);
};

// ============ ADMIN DASHBOARD ============
export const getAdminDashboardData = async () => {
  try {
    const [usersRes, employeesRes, commandesRes, facturesRes] = await Promise.all([
      apiClient.get("/users"),
      apiClient.get("/employees"),
      apiClient.get("/commandes"),
      apiClient.get("/factures"),
    ]);

    const users = normalizeCollection(usersRes);
    const employees = normalizeCollection(employeesRes);
    const commandes = normalizeCollection(commandesRes);
    const factures = normalizeCollection(facturesRes);

    // Calculate revenue from factures
    const revenue = factures.reduce((sum, f) => sum + (f.montantTotal || f.total || 0), 0);

    return {
      totalUsers: users.length,
      activeEmployees: employees.filter((e) => e.status === "active").length,
      totalOrders: commandes.length,
      revenue: revenue,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return {
      totalUsers: 0,
      activeEmployees: 0,
      totalOrders: 0,
      revenue: 0,
    };
  }
};

export const getAdminChartData = async () => {
  try {
    const [commandesRes, departmentsRes, targetsRes] = await Promise.all([
      apiClient.get("/commandes"),
      apiClient.get("/hr/departments"),
      apiClient.get("/targets/analytics/summary"),
    ]);

    const commandes = commandesRes.data?.data || commandesRes.data || [];
    const departments = departmentsRes.data?.data || departmentsRes.data || [];
    const targetChart = targetsRes.data?.data || targetsRes.data || [];

    // Revenue trend by month
    const monthlyData = {};
    commandes.forEach((cmd) => {
      const date = new Date(cmd.createdAt || cmd.date);
      const month = date.toLocaleString("en-US", { month: "short" });
      monthlyData[month] = (monthlyData[month] || 0) + (cmd.total || 0);
    });

    const revenueData = Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue,
      expenses: Math.floor(revenue * 0.4),
    }));

    // Department performance
    const departmentData = departments.map((d) => ({
      dept: d.name,
      employees: d.employeeCount || 0,
      revenue: Math.floor(Math.random() * 500000),
    }));

    return {
      revenueData,
      departmentData,
      targetData: targetChart,
    };
  } catch (error) {
    console.error("Error fetching admin chart data:", error);
    return {
      revenueData: [],
      departmentData: [],
      targetData: [],
    };
  }
};

// ============ SALES MANAGER DASHBOARD ============
export const getSalesManagerDashboardData = async () => {
  try {
    const [commandesRes, clientsRes, devisRes, bonCommandeRes] = await Promise.all([
      apiClient.get("/commandes", { params: { limit: 1000 } }),
      apiClient.get("/clients", { params: { limit: 1000 } }),
      apiClient.get("/devis", { params: { limit: 1000 } }),
      apiClient.get("/bon-commandes", { params: { limit: 1000 } }),
    ]);

    console.log('[getSalesManagerDashboardData] Raw responses:', { commandesRes, clientsRes, devisRes, bonCommandeRes });

    const allCommandes = normalizeCollection(commandesRes);
    const clients = normalizeCollection(clientsRes);

    // Filter to only DELIVERED orders for accurate sales metrics
    const commandes = allCommandes.filter((c) => c.status === "DELIVERED");

    const totalRevenue = commandes.reduce((sum, c) => sum + (c.totalAmount || c.montantTotal || c.total || 0), 0);
    const totalOrders = commandes.length;
    const activeClients = clients.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Quotes (devis) stats - consider all devis regardless of status
    const allDevis = normalizeCollection(devisRes);

    // DEBUG: log counts and sample records to help trace why KPIs are zero
    try {
      console.debug("[dashboardApi] sales fetch summary", {
        allCommandesCount: allCommandes.length,
        deliveredCommandesCount: allCommandes.filter((c) => c.status === "DELIVERED").length,
        sampleCommandes: (allCommandes || []).slice(0, 3).map((c) => ({ id: c.id || c._id, status: c.status, total: c.total || c.totalAmount || c.montantTotal })),
        allDevisCount: allDevis.length,
        sampleDevis: (allDevis || []).slice(0, 3).map((d) => ({ id: d.id || d._id, status: d.status || d.state })),
      });
    } catch (e) {
      // ignore logging errors
    }
    const totalQuotesSent = allDevis.length;
    const acceptedQuotes = allDevis.filter((d) => (d.status || d.state || "").toString().toUpperCase() === "ACCEPTED").length;
    const quoteAcceptanceRate = totalQuotesSent > 0 ? acceptedQuotes / totalQuotesSent : 0;
    // Count quotes with status 'SENT' / 'ENVOYE' (various possible spellings)
    const quotesSentCount = allDevis.filter((d) => {
      const s = (d.status || d.state || "").toString().toUpperCase();
      return s === "SENT" || s === "ENVOYE" || s === "ENVOYÉ" || s.includes("SENT") || s.includes("ENVOY");
    }).length;
    const clientSalesData = buildTurnoverSeries({
      records: commandes,
      entities: clients,
      relationKeys: ["client", "clientId", "client_id"],
      amountKeys: ["totalAmount", "montantTotal", "total"],
      fallbackLabel: "Client inconnu",
    });

    // Bon de commande (purchase orders) KPIs
    const allBonCommandes = normalizeCollection(bonCommandeRes);
    try {
      console.debug("[dashboardApi] bon-commandes summary", {
        allBonCommandesCount: allBonCommandes.length,
        sampleBonCommandes: (allBonCommandes || []).slice(0, 3).map((b) => ({ id: b.id || b._id, status: b.status })),
      });
    } catch (e) {}
    const totalPurchaseOrders = allBonCommandes.length;
    const purchaseOrdersDelivered = allBonCommandes.filter((b) => {
      const s = String(b.status || "").toUpperCase();
      return (
        s === "DELIVERED" ||
        s === "RECEIVED" ||
        s === "RECU" ||
        s.includes("DELIVER") ||
        s.includes("RECEIV") ||
        s.includes("LIVR")
      );
    }).length;
    const purchaseOrdersPending = allBonCommandes.filter((b) => {
      const s = String(b.status || "").toUpperCase();
      const isDelivered =
        s === "DELIVERED" ||
        s === "RECEIVED" ||
        s === "RECU" ||
        s.includes("DELIVER") ||
        s.includes("RECEIV") ||
        s.includes("LIVR");
      return !isDelivered && s !== "CANCELLED";
    }).length;

    const result = {
      totalRevenue,
      totalOrders,
      activeClients,
      averageOrderValue,
      totalQuotesSent,
      quoteAcceptanceRate,
      quotesSentCount,
      totalPurchaseOrders,
      purchaseOrdersDelivered,
      purchaseOrdersPending,
      commandes,
      clients,
      devis: allDevis,
      bonCommandes: allBonCommandes,
      clientSalesData,
    };
    console.log('[getSalesManagerDashboardData] Final result:', result);
    return result;
  } catch (error) {
    console.error("Error fetching sales dashboard data:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      activeClients: 0,
      averageOrderValue: 0,
      totalQuotesSent: 0,
      quoteAcceptanceRate: 0,
      totalPurchaseOrders: 0,
      purchaseOrdersDelivered: 0,
      purchaseOrdersPending: 0,
      commandes: [],
      clients: [],
      clientSalesData: [],
    };
  }
};

export const getSalesManagerChartData = async (period = "month") => {
  try {
    const [targetsRes, commandesRes] = await Promise.all([
      apiClient.get("/targets", { params: { limit: 1000 } }),
      apiClient.get("/commandes", { params: { limit: 1000 } }),
    ]);

    const targets = targetsRes.data?.data || targetsRes.data || [];
    const allCommandes = commandesRes.data?.data || commandesRes.data || [];

    // Filter to only DELIVERED orders
    const commandes = allCommandes.filter((c) => c.status === "DELIVERED");

    return buildDualLineSeries({
      actualRecords: commandes,
      objectiveRecords: targets,
      period,
      actualValueResolver: (commande) => commande.totalAmount || commande.montantTotal || commande.total || 0,
      objectiveValueResolver: (target) => target.targetValue || 0,
    }).map((item) => ({
      name: item.name,
      sales: item.actual,
      objective: item.objective,
    }));
  } catch (error) {
    console.error("Error fetching sales chart data:", error);
    return [];
  }
};

export const getSalesCategoryData = async () => {
  try {
    const res = await apiClient.get('/commandes/analytics/category', { params: { limit: 1000 } });
    const data = res.data?.data || res.data || [];
    // Ensure consistent shape
    return (Array.isArray(data) ? data : []).map((d) => ({ name: d.name || 'Autres', value: Number(d.value || 0) }));
  } catch (error) {
    console.error('Error fetching sales category data:', error);
    return [];
  }
};

export const getSalesProductData = async () => {
  try {
    const res = await apiClient.get('/commandes/analytics/product', { params: { limit: 10 } });
    const data = res.data?.data || res.data || [];
    return (Array.isArray(data) ? data : []).map((d) => ({ name: d.name || 'Produit inconnu', value: Number(d.value || 0) }));
  } catch (error) {
    console.error('Error fetching sales product data:', error);
    return [];
  }
};

export const getSalesLocations = async () => {
  try {
    const res = await apiClient.get('/analytics/sales/locations');
    const data = res.data?.data || res.data || [];
    return Array.isArray(data) ? data.map((d) => ({ location: d.location || d.address || "Inconnu", total: Number(d.total || 0), count: Number(d.count || 0) })) : [];
  } catch (error) {
    console.error('Error fetching sales locations:', error);
    return [];
  }
};

export const getPurchasesLocations = async () => {
  try {
    const res = await apiClient.get('/analytics/purchases/locations');
    const data = res.data?.data || res.data || [];
    return Array.isArray(data) ? data.map((d) => ({ location: d.location || d.city || d.address || "Inconnu", total: Number(d.total || 0), count: Number(d.count || 0) })) : [];
  } catch (error) {
    console.error('Error fetching purchases locations:', error);
    return [];
  }
};

export const getDevisFunnelData = async (period = "year") => {
  try {
    const res = await apiClient.get("/devis/analytics/funnel", { params: { period } });
    const data = res.data?.data || res.data || [];
    return {
      data: (Array.isArray(data) ? data : []).map((d) => ({
        name: d.name || "Etape inconnue",
        value: Number(d.value || 0),
        rate: Number(d.rate || 0),
      })),
      summary: res.data?.summary || {},
    };
  } catch (error) {
    console.error("Error fetching devis funnel data:", error);
    return { data: [], summary: {} };
  }
};

export const getDevisConversionData = async (period = "year") => {
  try {
    const res = await apiClient.get("/devis/analytics/conversion", { params: { period } });
    const data = res.data?.data || res.data || [];
    return {
      data: (Array.isArray(data) ? data : []).map((d) => ({
        name: d.name || "-",
        sent: Number(d.sent || 0),
        accepted: Number(d.accepted || 0),
        rejected: Number(d.rejected || 0),
      })),
      summary: res.data?.summary || {},
    };
  } catch (error) {
    console.error("Error fetching devis conversion data:", error);
    return { data: [], summary: {} };
  }
};

// ============ PROCUREMENT DASHBOARD ============
export const getProcurementDashboardData = async () => {
  try {
    const [achatsRes, suppliersRes, productRes] = await Promise.all([
      apiClient.get("/achats"),
      apiClient.get("/suppliers"),
      apiClient.get("/products"),
    ]);

    const allAchats = normalizeCollection(achatsRes);
    const suppliers = normalizeCollection(suppliersRes);
    const products = normalizeCollection(productRes);

    // Split received and not-yet-received purchases for dashboard stats
    const achats = allAchats
      .filter((a) => a.status === "RECEIVED")
      .map((a) => ({ ...a, totalAmountTND: getAchatTotalTnd(a) }));
    const achatsNonRecus = allAchats.filter((a) => a.status !== "RECEIVED");

    const totalPurchases = achats.reduce((sum, a) => sum + Number(a.totalAmountTND || 0), 0);
    const lowStockProducts = products.filter((p) => p.quantity < p.minThreshold).length;

    return {
      totalPurchases,
      supplierCount: suppliers.length,
      lowStockProducts,
      totalAchats: achatsNonRecus.length,
      achats,
      suppliers,
      products,
    };
  } catch (error) {
    console.error("Error fetching procurement dashboard data:", error);
    return {
      totalPurchases: 0,
      supplierCount: 0,
      lowStockProducts: 0,
      totalAchats: 0,
      achats: [],
      suppliers: [],
      products: [],
    };
  }
};

export const getProcurementChartData = async (period = "month") => {
  try {
    const [achatsRes, suppliersRes, productRes, budgetsRes] = await Promise.all([
      apiClient.get("/achats", { params: { limit: 1000 } }),
      apiClient.get("/suppliers", { params: { limit: 1000 } }),
      apiClient.get("/products", { params: { limit: 1000 } }),
      apiClient.get("/budgets", { params: { limit: 1000 } }),
    ]);

    const allAchats = normalizeCollection(achatsRes);
    const suppliers = normalizeCollection(suppliersRes);
    const products = normalizeCollection(productRes);
    const budgets = normalizeCollection(budgetsRes);
    const productById = new Map(
      products
        .map((product) => [String(product?._id || product?.id || ""), product])
        .filter(([id]) => id)
    );

    // Filter to only RECEIVED purchases for accurate spending data
    const achats = allAchats
      .filter((a) => a.status === "RECEIVED")
      .map((a) => ({ ...a, totalAmountTND: getAchatTotalTnd(a) }));

    const spendingData = buildDualLineSeries({
      actualRecords: achats,
      objectiveRecords: budgets,
      period,
      actualValueResolver: (achat) => achat.totalAmountTND || 0,
      objectiveValueResolver: (budget) => budget.totalBudget || 0,
    }).map((item) => ({
      name: item.name,
      spent: item.actual,
      budget: item.objective,
    }));

    // CA par fournisseur (only RECEIVED purchases)
    const supplierData = buildTurnoverSeries({
      records: achats,
      entities: suppliers,
      relationKeys: ["supplier", "supplierId", "supplier_id"],
      amountKeys: ["totalAmountTND"],
      fallbackLabel: "Fournisseur inconnu",
    });

    const productTurnover = new Map();
    achats.forEach((achat) => {
      (achat.items || []).forEach((item) => {
        const productRef = item?.product;
        const productId = String(productRef?._id || productRef?.id || productRef || item?.productId || item?.product_id || "");
        const product = productById.get(productId) || productRef || null;
        const productName =
          resolveEntityLabel(product) ||
          item?.productName ||
          item?.designation ||
          item?.name ||
          "Produit inconnu";

        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(item.unitCost || item.price || item.unitPrice || product?.purchasePriceTTC || product?.purchasePriceHT || 0);
        const lineTotal = Number(item.lineTotal || item.amount || item.total || quantity * unitPrice || 0);
        const turnoverKey = productId || productName;

        if (!turnoverKey) return;

        if (!productTurnover.has(turnoverKey)) {
          productTurnover.set(turnoverKey, {
            id: turnoverKey,
            name: productName,
            value: 0,
          });
        }

        const entry = productTurnover.get(turnoverKey);
        entry.name = entry.name || productName;
        entry.value += lineTotal;
      });
    });

    const productData = Array.from(productTurnover.values())
      .sort((left, right) => right.value - left.value)
      .slice(0, 10);

    // Purchase by category based on received purchase lines
    const categoryStats = {};
    achats.forEach((achat) => {
      (achat.items || []).forEach((item) => {
        const productRef = item?.product;
        const productId = String(productRef?._id || productRef?.id || productRef || "");
        const product = productById.get(productId) || productRef || null;
        const category = resolveCategoryLabel(product) || "Autres";

        if (!categoryStats[category]) {
          categoryStats[category] = 0;
        }

        const quantity = Number(item.quantity || 0);
        const unitPrice = Number(item.unitCost || item.price || product?.purchasePriceTTC || product?.purchasePriceHT || 0);
        categoryStats[category] += quantity * unitPrice;
      });
    });

    const categoryData = Object.entries(categoryStats).map(([category, value]) => ({
      name: category,
      value: Math.floor(value),
    })).filter((entry) => entry.value > 0);

    // PO status by month
    const months = ['Janv', 'Fevr', 'Mars', 'Avr', 'Mai', 'Juin'];
    const poStatusByMonth = {};
    months.forEach((month) => {
      poStatusByMonth[month] = { pending: 0, approved: 0, received: 0 };
    });

    achats.forEach((achat) => {
      const date = new Date(achat.createdAt || achat.date);
      const monthKey = date.toLocaleString('fr-FR', { month: 'short' });
      if (poStatusByMonth[monthKey]) {
        if (achat.status === 'pending' || achat.status === 'PENDING') 
          poStatusByMonth[monthKey].pending += 1;
        else if (achat.status === 'approved' || achat.status === 'APPROVED') 
          poStatusByMonth[monthKey].approved += 1;
        else if (achat.status === 'received' || achat.status === 'RECEIVED' || achat.status === 'delivered') 
          poStatusByMonth[monthKey].received += 1;
      }
    });

    const poStatusData = months.map((month) => ({
      month,
      ...poStatusByMonth[month],
    }));

    return {
      spendingData,
      supplierData,
      productData,
      categoryData,
      poStatusData,
      procurementBudget: budgets.find((budget) => {
        const now = new Date();
        return Number(budget.month) === now.getMonth() + 1 && Number(budget.year) === now.getFullYear();
      }) || budgets[0] || null,
    };
  } catch (error) {
    console.error("Error fetching procurement chart data:", error);
    return {
      spendingData: [],
      supplierData: [],
      productData: [],
      categoryData: [],
      poStatusData: [],
      procurementBudget: null,
    };
  }
};

// ============ FINANCE DASHBOARD ============
export const getFinanceDashboardData = async () => {
  try {
    const [facturesRes, paiementsRes, achatsRes] = await Promise.all([
      apiClient.get("/factures"),
      apiClient.get("/paiements"),
      apiClient.get("/achats"),
    ]);

    const factures = facturesRes.data?.data || facturesRes.data || [];
    const paiements = paiementsRes.data?.data || paiementsRes.data || [];
    const achats = achatsRes.data?.data || achatsRes.data || [];

    const totalInvoiced = factures.reduce((sum, f) => sum + (f.montantTotal || f.total || 0), 0);
    const totalPaid = paiements.reduce((sum, p) => sum + (p.montant || p.amount || 0), 0);
    const totalExpenses = achats.reduce((sum, a) => sum + (a.montantTotal || a.total || 0), 0);
    const netProfit = totalInvoiced - totalExpenses;

    return {
      totalInvoiced,
      totalPaid,
      totalExpenses,
      netProfit,
    };
  } catch (error) {
    console.error("Error fetching finance dashboard data:", error);
    return {
      totalInvoiced: 0,
      totalPaid: 0,
      totalExpenses: 0,
      netProfit: 0,
    };
  }
};

// ============ LOGISTICS DASHBOARD ============
export const getLogisticsDashboardData = async () => {
  try {
    const [livraisonsRes, transportersRes] = await Promise.all([
      apiClient.get("/livraisons"),
      apiClient.get("/transporters"),
    ]);

    const livraisons = livraisonsRes.data?.data || livraisonsRes.data || [];
    const transporters = transportersRes.data?.data || transportersRes.data || [];

    const deliveredCount = livraisons.filter((l) => l.status === "delivered").length;
    const pendingCount = livraisons.filter((l) => l.status === "pending").length;

    return {
      totalDeliveries: livraisons.length,
      deliveredCount,
      pendingCount,
      activeTransporters: transporters.length,
    };
  } catch (error) {
    console.error("Error fetching logistics dashboard data:", error);
    return {
      totalDeliveries: 0,
      deliveredCount: 0,
      pendingCount: 0,
      activeTransporters: 0,
    };
  }
};

// ============ MANAGER DASHBOARD ============
export const getManagerDashboardData = async () => {
  try {
    const [employeesRes, departmentsRes] = await Promise.all([
      apiClient.get("/employees"),
      apiClient.get("/hr/departments"),
    ]);

    const employees = employeesRes.data?.data || employeesRes.data || [];
    const departments = departmentsRes.data?.data || departmentsRes.data || [];

    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const departmentCount = departments.length;
    const performanceScore = Math.floor(Math.random() * 100);

    return {
      totalEmployees: employees.length,
      activeEmployees,
      departmentCount,
      performanceScore,
    };
  } catch (error) {
    console.error("Error fetching manager dashboard data:", error);
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      departmentCount: 0,
      performanceScore: 0,
    };
  }
};

// ============ USER DASHBOARD ============
export const getUserDashboardData = async () => {
  try {
    // For regular users, show minimal data
    return {
      myTasks: 12,
      completedTasks: 28,
      teamMembers: 8,
      performance: 85,
    };
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    return {
      myTasks: 0,
      completedTasks: 0,
      teamMembers: 0,
      performance: 0,
    };
  }
};
