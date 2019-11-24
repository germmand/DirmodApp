import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import QuotationService from '../../services/quotation.service';

import MainPage from './main.page';

jest.mock('../../services/quotation.service');
jest.useFakeTimers();

describe('MainPage Component', () => {
  beforeEach(() => {
    QuotationService.getQuotation.mockClear();
  });

  it('should match snapshot', () => {
    const props = {
    };
    const component = renderer.create(
      <MainPage {...props} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // NOTE:
  // We want the disableLifecycleMethods set to true so that it doesn't call
  // neither componentDidMount nor componentDidUpdate automatically thus we can alter the state
  // accordingly before doing the actual test, since as of Enzyme V3
  // the shallow API does call the React lifecycle methods.
  // As pretty much all of the operations in MainPage start at mounting (i.e. componentDidMount).
  // --------------

  it('substracts one to refreshingCounter if greater than zero and no request made', () => {
    const wrapper = shallow(<MainPage />, { disableLifecycleMethods: true });
    const refreshingCounter = 5;
    const expectedRefreshingCounter = refreshingCounter - 1;
    wrapper.setState({
      refreshingCounter,
      httpRequestMade: false,
    });
    wrapper.instance().componentDidMount();
    jest.advanceTimersByTime(1000);
    expect(wrapper.state().refreshingCounter).toEqual(expectedRefreshingCounter);
  });

  it('does not call setState if there\'s any http request pending', () => {
    const wrapper = shallow(<MainPage />, { disableLifecycleMethods: true });
    // We check if refreshingCounter retained its previous value because
    // this is the property that's intended to change periodically. If it's zero
    // it'll be updated to 5, otherwise it'll decrease by one.
    // So if httpRequestMade is true, no changes to the state should've been triggered
    // hence refreshingCounter should've retained its value.
    const refreshingCounter = 4;
    wrapper.setState({
      httpRequestMade: true,
      refreshingCounter,
    });
    wrapper.instance().componentDidMount();
    jest.advanceTimersByTime(1000);
    expect(wrapper.state().refreshingCounter).toEqual(refreshingCounter);
  });

  it('calls getQuotation using urlCode', () => {
    const dummyCurrencies = [{
        code: "USD",
        urlCode: "dolar",
        quotation: 23.15,
        symbol: "$",
      }, {
        code: "EUR",
        urlCode: "euro",
        quotation: 54.25,
        symbol: "$",
    }];
    const mockedResponses = dummyCurrencies.map(c => ({
      currency: c.code,
      price: c.quotation + 5,
    }));
    QuotationService.getQuotation.mockImplementation((currency) => {
      const currencyFromState = dummyCurrencies
        .find(c => c.urlCode === currency);
      const mockedResponse = mockedResponses
        .find(m => m.currency === currencyFromState.code);
      return Promise.resolve(mockedResponse);
    });
    const wrapper = shallow(<MainPage />, { disableLifecycleMethods: true });
    wrapper.setState({
      httpRequestMade: false,
      refreshingCounter: 0,
      currencies: dummyCurrencies,
    });
    wrapper.instance().componentDidMount();
    jest.advanceTimersByTime(1000);
    expect(QuotationService.getQuotation).toHaveBeenCalledTimes(dummyCurrencies.length);
    dummyCurrencies.forEach(c => {
      expect(QuotationService.getQuotation).toHaveBeenCalledWith(c.urlCode);
    });
  });

  it('updates quotation into state properly', (done) => {
    const dummyCurrencies = [{
      code: "USD",
      urlCode: "dolar",
      quotation: 23.15,
      symbol: "$",
    }, {
      code: "EUR",
      urlCode: "euro",
      quotation: 54.25,
      symbol: "$",
    }];
    const mockedResponses = dummyCurrencies.map(c => ({
      currency: c.code,
      price: c.quotation + 5,
    }));
    const expectedCurrenciesState = dummyCurrencies.map(c => {
      const mockedResponse = mockedResponses
        .find(m => m.currency === c.code);
      return {
        ...c,
        quotation: mockedResponse.price,
      };
    });
    QuotationService.getQuotation.mockImplementation((currency) => {
      const currencyFromState = dummyCurrencies
        .find(c => c.urlCode === currency);
      const mockedResponse = mockedResponses
        .find(m => m.currency === currencyFromState.code);
      return Promise.resolve(mockedResponse);
    });
    const wrapper = shallow(<MainPage />, { disableLifecycleMethods: true });
    wrapper.setState({
      httpRequestMade: false,
      refreshingCounter: 0,
      currencies: dummyCurrencies,
    });
    wrapper.instance().componentDidMount();
    jest.advanceTimersByTime(1000);
    // Since the second state change happens in the setState's callback asynchronously,
    // the operation is placed back onto the event loop and executed on the next tick.
    // By wrapping the assertion in this function, we can guarantee it'll run
    // on the same tick as the second state update and since the event loop follows a FIFO model,
    // the assertion will run *after* the second asynchronous update.
    process.nextTick(() => {
      expect(wrapper.state().currencies).toEqual(expectedCurrenciesState);
      done();
    });
  });
});
