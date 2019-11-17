import React from 'react';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

import FlagIcon from '../FlagIcon';

import './QuotationPanel.css';

const QuotationPanel = ({ code, symbol, quotation, flagSize, isRefreshing }) => (
  <Card body>
    <div className="panel">
      <div className="flag-code-container">
        <FlagIcon code={code} size={flagSize} />
        <span className="text-bold">
          &nbsp;
          { code }
        </span>
      </div>
      { !isRefreshing ? (
        <div>
          <span className="text-bold">{ symbol }</span>
          <span className="text-bold">
            {' '}
            { quotation }
          </span>
        </div>
        ) : (
          <Spinner animation="border" />
        )}
    </div>
  </Card>
);

QuotationPanel.propTypes = {
  code: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  quotation: PropTypes.number.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  flagSize: PropTypes.number,
};

QuotationPanel.defaultProps = {
  flagSize: 55,
};

export default QuotationPanel;