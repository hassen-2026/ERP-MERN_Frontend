const roundMoney = (value) => Number(Number(value || 0).toFixed(2));

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

export const computeCommercialTotals = (items = [], options = {}) => {
  const priceFieldName = options.priceFieldName || "unitPrice";
  const productsById = options.productsById || new Map();

  let totalHT = 0;
  let tvaAmount = 0;

  (items || []).forEach((item) => {
    const productId = String(item?.productId || item?.product || item?.product_id || "").trim();
    const quantity = toNumber(item?.quantity, 0);
    const unitPrice = toNumber(item?.[priceFieldName] ?? item?.unitPrice ?? item?.unitCost, 0);
    const product = productsById.get(productId) || item?.product || {};
    const tvaRate = toNumber(product?.tvaRate ?? product?.taxRate ?? product?.rate, 0.19);

    if (!productId || quantity <= 0 || unitPrice < 0) {
      return;
    }

    const lineHT = quantity * unitPrice;
    const lineTVA = lineHT * tvaRate;
    totalHT += lineHT;
    tvaAmount += lineTVA;
  });

  totalHT = roundMoney(totalHT);
  tvaAmount = roundMoney(tvaAmount);

  return {
    totalHT,
    tvaAmount,
    totalTTC: roundMoney(totalHT + tvaAmount),
  };
};

export const buildProductsById = (products = []) => {
  const map = new Map();

  (products || []).forEach((product) => {
    const id = String(product?.id || product?._id || "").trim();
    if (id) {
      map.set(id, product);
    }
  });

  return map;
};