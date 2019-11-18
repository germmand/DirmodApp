import http from '../utils/http';

// This is made public for unit-testing purposes.
export const getQuotationUrl = (currency) => `cotizacion/${currency}`;

const getQuotation = (currency) => {
  return http.get(getQuotationUrl(currency))
             .then(res => res.data);
};

const QuotationServices = {
  getQuotation,
};

export default QuotationServices;

