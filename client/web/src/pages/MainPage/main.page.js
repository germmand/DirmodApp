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
    };
  }

  onUpdateCurrencies = (currenciesUpdated) => {
    const { currencies } = this.state;
    const updatedCurrenciesForState = currencies.map(c => {
      const currency = currenciesUpdated.find(uc => uc.currency === c.code);
      return {
        ...c,
        // Round to two decimals if necessary.
        quotation: Number(Math.round(currency.price + 'e2') + 'e-2'),
      };
    });
    this.setState(state => {
      return {
        ...state,
        currencies: updatedCurrenciesForState,
        isRefreshing: false,
      };
    });
  }

  async componentDidMount() {
    const [usdRes, eurRes, brlRes] = await Promise.all([
      QuotationService.getQuotation('dolar'),
      QuotationService.getQuotation('euro'),
      QuotationService.getQuotation('real')
    ]);
    this.onUpdateCurrencies([usdRes, eurRes, brlRes]);
  }

  render() {
    const { currencies, isRefreshing } = this.state;

    return (
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
    );
  }
}

export default MainPage;