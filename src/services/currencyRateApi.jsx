import apiClient from "./apiClient";

const CURRENCY_RATE_ROUTE = "/currency-rates";

export const getCurrencyRates = async () => {
  const response = await apiClient.get(CURRENCY_RATE_ROUTE);
  return response.data;
};

export const updateCurrencyRates = async (rates) => {
  const response = await apiClient.put(CURRENCY_RATE_ROUTE, { rates });
  return response.data;
};

export const currencyRateApi = {
  getCurrencyRates,
  updateCurrencyRates,
};

export default currencyRateApi;