import React from 'react';

import './main.page.css';
import QuotationService from '../../services/quotation.service';

import QuotationPanel from '../../components/QuotationPanel';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [{
        code: "BRL",
        urlCode: "real",
        quotation: 0.00,
        symbol: "$"
      }, {
        code: "USD",
        urlCode: "dolar",
        quotation: 0.00,
        symbol: "$"
      }, {
        code: "EUR",
        urlCode: "euro",
        quotation: 0.00,
        symbol: "$"
      }],
      isRefreshingSpinners: true,
      httpRequestMade: false,
      refreshingCounter: 0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      const { refreshingCounter, httpRequestMade } = this.state;
      // setState runs asynchronously,
      // and since setInterval runs every second, we don't want it to go
      // beyond this point (hit any of the setState below)
      // if the previous (request) is not yet finished.
      if (httpRequestMade) return;

      if (refreshingCounter === 0) {
        this.setState(state => {
          return {
            ...state,
            isRefreshingSpinners: true,
            httpRequestMade: true,
          };
        }, async () => {
          // All of the state changes are chained together through callbacks from this point.
          // As mentioned above, this is due to setState async nature.
          await this.onUpdateQuotations();
        });
      } else {
        this.setState(state => {
          return {
            ...state,
            refreshingCounter: refreshingCounter - 1,
          };
        });
      }
    }, 1000);
  }

  async onUpdateQuotations() {
    try {
      const { currencies } = this.state;
      // This is done like this so that adding (or deleting) more currencies is easier.
      // Since only the currencies array within the initial state will need to be updated.
      const quotationRequests = currencies.map(c => {
        return QuotationService.getQuotation(c.urlCode);
      });
      const quotationsUpdated = await Promise.all(quotationRequests);
      this.onUpdateCurrenciesState(quotationsUpdated, () => {
        this.setState(state => {
          return {
            ...state,
            httpRequestMade: false,
            refreshingCounter: 5,
          };
        });
      });
    } catch(e) {
      // This try-catch block is placed here in order to
      // prevent UnhandledPromiseRejection exception when unit-testing.
      // -----
      // Here should also be handled the API-related errors.
    }
  }

  onUpdateCurrenciesState(currenciesUpdated, callback) {
    const { currencies } = this.state;
    const updatedCurrenciesForState = currencies.map(c => {
      const currency = currenciesUpdated.find(uc => uc.currency === c.code);
      return {
        ...c,
        // Round to two decimals if necessary.
        quotation: Number(`${Math.round(`${currency.price  }e2`)  }e-2`),
      };
    });
    this.setState(state => {
      return {
        ...state,
        currencies: updatedCurrenciesForState,
        isRefreshingSpinners: false,
      };
    }, callback);
  }

  render() {
    const { currencies, isRefreshingSpinners, refreshingCounter } = this.state;

    return (
      <div className="container">
        <div className="quotations-panel">
          {
            currencies.map(c => (
              <QuotationPanel
                key={c.code}
                code={c.code}
                symbol={c.symbol}
                isRefreshing={isRefreshingSpinners}
                quotation={c.quotation}
              />
            ))
          }
        </div>
        <div className="spinner-container">
          <div className="spinner" />
          <span className="spinner-text">{ refreshingCounter }</span>
        </div>
      </div>
    );
  }
}

export default MainPage;