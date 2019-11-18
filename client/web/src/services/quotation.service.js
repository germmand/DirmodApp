import http from '../utils/http';

const getQuotation = (currency) => {
  return http.get(`cotizacion/${currency}`)
             .then(res => res.data);
};

const QuotationServices = {
  getQuotation,
};

export default QuotationServices;

