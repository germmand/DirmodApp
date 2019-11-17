import React from 'react';
import './App.css';

import QuotationPanel from './components/QuotationPanel';

function App() {
  return (
    <div className="App">
      <div className="quotations-panel">
        <QuotationPanel code="BRL" symbol="R$" quotation={45.56} isRefreshing={!true} />
        <QuotationPanel code="USD" symbol="$" quotation={35.48} isRefreshing />
        <QuotationPanel code="EUR" symbol="€" quotation={10.99} isRefreshing={!true} />
      </div>
    </div>
  );
}

export default App;
