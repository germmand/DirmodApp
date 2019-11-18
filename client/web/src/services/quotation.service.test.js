import QuotationService, { getQuotationUrl } from './quotation.service';
import http from '../utils/http';

const mockData = {
  data: {
    currency: 'USD',
    price: '25.55'
  },
  status: 200,
};
jest.mock('../utils/http', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve(mockData)),
}));


describe('QuotationService', () => {
  it('calls the correct url', () => {
    const currency = 'dolar';
    const expectedUrl = getQuotationUrl(currency);
    QuotationService.getQuotation(currency)
      .then(() => {
        expect(http.get).toHaveBeenCalledWith(expectedUrl);
      });
  });

  it('maps the returned result to be only data', () => {
    const currency = 'dolar';
    QuotationService.getQuotation(currency)
      .then((res) => {
        expect(res).toEqual(mockData.data);
      });
  })
});