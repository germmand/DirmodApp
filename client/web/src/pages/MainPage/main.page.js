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
        quotation: 0.00,
        symbol: "$"
      }, {
        code: "USD",
        quotation: 0.00,
        symbol: "$"
      }, {
        code: "EUR",
        quotation: 0.00,
        symbol: "$"
      }],
      isRefreshing: true,
      refreshingCounter: 5,
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      const [usdRes, eurRes, brlRes] = await Promise.all([
        QuotationService.getQuotation('dolar'),
        QuotationService.getQuotation('euro'),
        QuotationService.getQuotation('real')
      ]);
      this.onUpdateCurrencies([usdRes, eurRes, brlRes]);
    } catch(e) {
      // This try-catch block is placed here in order to
      // prevent UnhandledPromiseRejection exception when unit-testing.
      // -----
      // Here should also be handled the API-related errors.
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onUpdateCurrencies(currenciesUpdated) {
    const { currencies } = this.state;
    const updatedCurrenciesForState = currencies.map(c => {
      const currency = currenciesUpdated.find(uc => uc.currency === c.code);
      return {
        ...c,
        // Round to two decimals if necessary.
        quotation: Number(`${Math.round(`${currency.price  }e2`)  }e-2`),
      };
    });
    if(this._isMounted) {
      this.setState(state => {
        return {
          ...state,
          currencies: updatedCurrenciesForState,
          isRefreshing: false,
        };
      });
    }
  }

  render() {
    const { currencies, isRefreshing, refreshingCounter } = this.state;

    return (
      <div className="container">
        <div className="quotations-panel">
          {
            currencies.map(c => (
              <QuotationPanel
                key={c.code}
                code={c.code}
                symbol={c.symbol}
                isRefreshing={isRefreshing}
                quotation={c.quotation}
              />
            ))
          }
        </div>
        <div className="spinner-container">
          <div className="spinner">
          </div>
          <span className="spinner-text">{ refreshingCounter }</span>
        </div>
      </div>
    );
  }
}

export default MainPage;