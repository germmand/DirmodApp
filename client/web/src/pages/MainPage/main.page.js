import React from 'react';

import './main.page.css';

import QuotationPanel from '../../components/QuotationPanel';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [{
        code: "BRL",
        quotation: 0.00,
        symbol: "R$"
      }, {
        code: "USD",
        quotation: 0.00,
        symbol: "$"
      }, {
        code: "EUR",
        quotation: 0.00,
        symbol: "€"
      }],
      isRefreshing: false,
    };
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